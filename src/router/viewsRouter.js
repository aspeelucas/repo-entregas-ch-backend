import { Router } from "express";
import passport from "passport";
import {
  unauthorizedRoute,
  unauthorizedRouteRedirectLogin,
} from "../utils/util.js";
import ViewsController from "../controllers/views.controllers.js";

const viewsController = new ViewsController();

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  res.redirect("/login");
});

viewRouter.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.getRealTimeProducts
);

viewRouter.get("/chat", unauthorizedRouteRedirectLogin(), viewsController.chat);

viewRouter.get(
  "/products",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.getProducts
);

viewRouter.get(
  "/carts/:cid",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.getCart
);

// Rutas de autenticación

viewRouter.get("/register", unauthorizedRoute(), viewsController.register);

viewRouter.get("/login", unauthorizedRoute(), viewsController.login);
