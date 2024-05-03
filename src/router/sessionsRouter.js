import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";
import generateToken from "../utils/jsonwebtoken.js";
import { passportCall } from "../utils/util.js";
import { CartManager } from "../controllers/carts-manager.js";

const cartManager = new CartManager();

export const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400).send("Usuario ya registrado");
    } else {
      const rol =
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? "admin"
          : "user";

      const cart = await cartManager.addCart();
      const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        rol,
        cart: cart._id,
      };
      const user = await userModel.create(newUser);
      const token = generateToken({
        email: user.email,
        id: user._id,
        rol: user.rol,
      });
      res
        .status(200)
        .cookie("coderCookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect("/products");
    }
  } catch (error) {
    res.status(400).send("Error al registrar usuario");
  }
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      res.status(400).send("Usuario no encontrado");
    } else if (isValidPassword(password, userExists) === false) {
      res.status(400).send("Credenciales invalidas");
    }
    const token = generateToken({
      email: userExists.email,
      id: userExists._id,
      rol: userExists.rol,
    });

    res
      .status(200)
      .cookie("coderCookie", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
  } catch (error) {
    res.status(400).send("Error al loguear usuario");
  }
});

// current user token

sessionsRouter.get(
  "/current",
  passportCall("jwt"),
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/sessions/failedregister",
  }),
  (req, res) => {
    res.send(req.user);
  }
);

// login with github
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

// Route for failed register
sessionsRouter.get("/failedregister", (req, res) => {
  res.status(400).send("Error al registrar usuario");
});

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send("Credenciales invalidas");
    }

    const token = generateToken({
      email: req.user.email,
      id: req.user._id,
      rol: req.user.rol,
    });

    res
      .status(200)
      .cookie("coderCookie", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/products");
  }
);

// Route for failed login

sessionsRouter.get("/failedlogin", (req, res) => {
  res.status(400).send("Error al loguear usuario");
});

// Logout passport-jwt

sessionsRouter.get("/logout", async (req, res) => {
  res.clearCookie("coderCookie");
  res.redirect("/login");
});
