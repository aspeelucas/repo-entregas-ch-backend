import UsersService from "../services/users.service.js";
import CartService from "../services/carts.service.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import generateToken from "../utils/jsonwebtoken.js";
import generateResetToken from "../utils/tokenreset.js";
import { userModel } from "../models/user.model.js";
import EmailService from "../services/email.services.js";
import fs from "fs";

// ver agregar a carrito en user controller

const cartServices = new CartService();
const usersService = new UsersService();
const emailService = new EmailService();

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

        const cart = await cartServices.addCart(email);
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
          id: user._id,
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
        return res.status(400).send("Usuario no encontrado");
      } else if (isValidPassword(password, userExists) === false) {
        return res.status(400).send("Credenciales invalidas");
      }
      const last_connection = new Date();

      await userModel.findByIdAndUpdate(userExists._id, {
        last_connection,
      });


      const token = generateToken({
        email: userExists.email,
        rol: userExists.rol,
        first_name: userExists.first_name,
        last_name: userExists.last_name,
        id: userExists._id,
        cart: userExists.cart,
        last_connection: last_connection,
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
  // Cambiar rol

  async changeRolePremium(req, res) {
    try {
      const { uid } = req.params;
      const user = await userModel.findById(uid);
      if (!user) {
        req.logger.info(`Usuario no encontrado`);
        return res.status(404).send("Usuario no encontrado");
      }
      if (user.documents.length != 3) {
        req.logger.info(`Complete los documentos primero para cambiar a premium`);
        return res.status(400).send("Complete los documentos primero para cambiar a premium");
      }

      const newRole = user.rol === "user" ? "premium" : "user";

      const updatedUser = await userModel.findByIdAndUpdate(
        uid,
        { rol: newRole },
        { new: true }
      );
      req.logger.info(`Rol cambiado a ${newRole}`);
      return res.status(200).send(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(400).send("Error al cambiar rol");
    }
  }

  async addDocuments(req, res) {
    try {
      const { uid } = req.params;
      const user = await userModel.findById(uid);
      const files = req.files;
      console.log(uid);
      console.log(files);
      if (!user) {
        req.logger.info(`Usuario no encontrado`);
        return res.status(404).send("Usuario no encontrado");
      }
      if (req.files.length !== 3) {
        req.logger.info(`Faltan documentos`);
        return res.status(400).send("Faltan documentos");
      }
      if (!fs.existsSync(`./src/public/documents`)) {
        fs.mkdirSync(`./src/public/documents`);
      }
      for (let i = 0; i < files.length; i++) {
        fs.writeFileSync(
          `./src/public/documents/${Date.now()}-${files[i].originalname}`,
          files[i].buffer
        );
      }
      const documents = [
        {
          name: "identification",
          reference: `./src/public/documents/${Date.now()}-${files[0].originalname}`,
        },
        {
          name: "address",
          reference: `./src/public/documents/${Date.now()}-${files[1].originalname}`,
        },
        {
          name: "account",
          reference: `./src/public/documents/${Date.now()}-${files[2].originalname}`,
        },
      ];
      const updatedUser = await userModel.findByIdAndUpdate(
        uid,
        { documents: documents },
        { new: true }
      );
      req.logger.info(`Documentos subidos`);
      return res.status(200).send(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(400).send("Error al subir documentos");
    }
  }

  async currentUser(req, res) {
    res.send(req.user);
  }

  async requestResetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).redirect("/user-not-found");
      }
      const token = generateResetToken();
      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 360000),
      };
      await user.save();
      await emailService.sendEmailResetPassword(email, user.first_name, token);
      return res.status(200).redirect("/send-email");
    } catch (error) {
      res.status(400).send("Error al solicitar reset de contraseña");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).redirect("/user-not-found");
      }
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.status(400).redirect("/invalid-token");
      }
      const now = new Date();
      if (now > resetToken.expiresAt) {
        return res.status(400).redirect("/expired-token");
      }

      if (isValidPassword(password, user)) {
        return res.status(400).redirect("/password-repeat-error");
      } else {
        user.password = createHash(password);
        user.resetToken = undefined;
        await user.save();
        return res.status(200).redirect("/update-password");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send("Error al restablecer contraseña");
    }
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
      id: req.user._id,
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
    const last_connection = new Date();
    await userModel.findByIdAndUpdate(req.user._id, {
      last_connection,
    });
    res.clearCookie("coderCookie");
    res.redirect("/login");
  }
}

export default UserController;
