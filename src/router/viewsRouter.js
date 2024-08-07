import { Router } from "express";
import passport from "passport";
import {
  authorization,
  unauthorizedRoute,
  authorizationUsers,
  unauthorizedRouteRedirectLogin,
  generateProducts,
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
  authorization("admin"),
  viewsController.getRealTimeProducts
);
viewRouter.get(
  "/panel-premium",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  authorization("premium"),
  viewsController.panelPremium
);
viewRouter.get(
  "/chat",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  authorizationUsers("admin"),
  viewsController.chat
);

viewRouter.get(
  "/products",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  authorizationUsers("admin"),
  viewsController.getProducts
);


viewRouter.get(
  "/carts/:cid",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  authorizationUsers("admin"),
  viewsController.getCart
);

viewRouter.get(
  "/checkout/:cid",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.checkout
);

viewRouter.get("/users-list", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),authorization("admin"), viewsController.usersList);

// Rutas de autenticación

viewRouter.get("/register", unauthorizedRoute(), viewsController.register);

viewRouter.get("/login", unauthorizedRoute(), viewsController.login);

viewRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.currentUser
);

// Rutas Mock

viewRouter.get("/mockingproducts", viewsController.mockingProducts);

// Rutas restablecer contraseña

viewRouter.get("/reset-password", viewsController.resetPassword);
viewRouter.get("/change-password", viewsController.changePassword);
viewRouter.get("/send-email", viewsController.sendEmail);
viewRouter.get("/user-not-found", viewsController.userNotFound);
viewRouter.get("/password-invalid-user", viewsController.passwordInvalid);
viewRouter.get("/invalid-token", viewsController.invalidToken);
viewRouter.get("/expired-token", viewsController.expiredToken);
viewRouter.get("/password-repeat-error", viewsController.passRepeatError);
viewRouter.get("/update-password", viewsController.updatePassword);

// Ruta para agregar rol premium

viewRouter.get(
  "/premium-documents",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewsController.premiumDocuments
);
