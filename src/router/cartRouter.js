import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const cartController = new CartController();

export const cartRouter = Router();

cartRouter.post("/", cartController.addCart);

cartRouter.get("/", cartController.getCarts);

cartRouter.get("/:cid", cartController.getCart);

cartRouter.post("/:cid/product/:pid", cartController.addProductToCart);

cartRouter.put("/:cid", cartController.updateProductFromCart);

cartRouter.delete("/:cid/product/:pid", cartController.deleteProductFromCart);

cartRouter.delete("/:cid", cartController.deleteAllProductsFromCart);

cartRouter.delete("/delete/:cid", cartController.deleteCart);

cartRouter.post("/:cid/purchase", cartController.finishPurchase);
