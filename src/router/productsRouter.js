import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();

export const productsRouter = Router();

productsRouter.get("/", productController.getProducts);

productsRouter.get("/:pid", productController.getProductById);

productsRouter.post("/", productController.addProduct);

productsRouter.put("/:pid", productController.updateProduct);

productsRouter.delete("/:pid", productController.deleteProduct);
