import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

export const sessionsRouter = Router();


// PASSPORT VERSION
// register passport local
sessionsRouter.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send("Credenciales invalidas");
    }
    req.session.login = true;
    req.session.user = {
      ...req.user._doc,
    };

    res.redirect("/products");
  }
);

// login passport local

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failedlogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send("Credenciales invalidas");
    }
    req.session.login = true;
    req.session.user = {
      ...req.user._doc,
    };

    res.redirect("/products");
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
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send("Credenciales invalidas");
    }
    req.session.login = true;
    req.session.user = {
      ...req.user._doc,
    };

    res.redirect("/products");
  }
);

// Route for failed login

sessionsRouter.get("/failedlogin", (req, res) => {
  res.status(400).send("Error al loguear usuario");
});

// Logout de usuario

sessionsRouter.get("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }

  res.redirect("/login");
});
