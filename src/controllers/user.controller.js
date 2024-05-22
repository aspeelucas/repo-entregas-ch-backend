import UsersService from "../services/users.service.js";
import CartService from "../services/carts.service.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import generateToken from "../utils/jsonwebtoken.js";

// ver agregar a carrito en user controller

const cartServices = new CartService();
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

        const cart = await cartServices.addCart();
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
          rol: user.rol,
          first_name: user.first_name,
          last_name: user.last_name,
          id : user._id,
          cart: user.cart,
        });
        res
          .status(200)
          .cookie("coderCookie", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
          })
          .redirect("/current");
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
        rol: userExists.rol,
        first_name: userExists.first_name,
        last_name: userExists.last_name,
        id : userExists._id,
        cart: userExists.cart,
      });

      res
        .status(200)
        .cookie("coderCookie", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        })
        .redirect("/current");
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
      rol: req.user.rol,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      id : req.user._id,
      cart: req.user.cart,
    });

    res
      .status(200)
      .cookie("coderCookie", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/current");
  }

  async logout(req, res) {
    res.clearCookie("coderCookie");
    res.redirect("/login");
  }
}

export default UserController;
