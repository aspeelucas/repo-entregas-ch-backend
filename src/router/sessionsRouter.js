import { Router } from "express";
import passport from "passport";
import { authorization, passportCall } from "../utils/util.js";
import UserController from "../controllers/user.controller.js";

const usersController = new UserController();

export const sessionsRouter = Router();

sessionsRouter.post("/register", usersController.registerUser);

sessionsRouter.post("/login", usersController.loginUser);

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

sessionsRouter.get("/logout", usersController.logout);
