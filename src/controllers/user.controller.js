import UsersService from "../services/users.service.js";
import CartController from "./cart.controller.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import generateToken from "../utils/jsonwebtoken.js";
import { passportCall } from "../utils/util.js";
import { CartManager } from "../controllers/carts-manager.js";

// ver agregar a carrito en user controller

const cartManager = new CartManager();
const cartServices = new CartController();
const usersService = new UsersService();

class UserController {
  async registerUser(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const userExists = await usersService.findUser(email);
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
        const user = await usersService.addUser(newUser);
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
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const userExists = await usersService.findUser(email);
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
  }

  async currentUser(req, res) {
    res.send(req.user);
  }

  async github(req, res) {
    async (req, res) => {};
  }

  async githubCallback(req, res) {
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

  async logout(req, res) {   
      res.clearCookie("coderCookie");
      res.redirect("/login");
    };
  
}

export default UserController;
