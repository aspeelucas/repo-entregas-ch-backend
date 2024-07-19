import { Router } from "express";
import passport from "passport";
import { authorization, passportCall } from "../utils/util.js";
import UserController from "../controllers/user.controller.js";
import multer from "multer";
import fs from "fs";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const folder = req.body.folder;

//     if (!fs.existsSync(`./src/public/${folder}`)) {
//       fs.mkdirSync(`./src/public/${folder}`);
//     }
//     cb(null, `./src/public/${folder}`);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const usersController = new UserController();

export const sessionsRouter = Router();

sessionsRouter.post("/register", usersController.registerUser);

sessionsRouter.post("/login", usersController.loginUser);

sessionsRouter.post(
  "/requestPasswordReset",
  usersController.requestResetPassword
);

sessionsRouter.post("/reset-password", usersController.resetPassword);

sessionsRouter.post("/premium/:uid", usersController.changeRolePremium);

sessionsRouter.post(
  "/:uid/documents",
  multer().array("files"),
  usersController.addDocuments
);

sessionsRouter.get(
  "/current",
  passportCall("jwt"),
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/sessions/failedregister",
  }),
  authorization("user"),
  usersController.currentUser
);

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  usersController.github
);

sessionsRouter.get("/failedregister", (req, res) => {
  res.status(400).send("Error al registrar usuario");
});

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  usersController.githubCallback
);

sessionsRouter.get("/failedlogin", (req, res) => {
  res.status(400).send("Error al loguear usuario");
});

sessionsRouter.get(
  "/logout",
  passportCall("jwt"),
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/api/sessions/failedregister",
  }),
  usersController.logout
);
