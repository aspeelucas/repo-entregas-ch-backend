import { Router } from "express";
import { ProductManager } from "../controllers/products-manager.js";

const productManger = new ProductManager();

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const products = await productManger.getProducts(limit, page, sort, query);
    res.json({
      status: "success",
      payload: products,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManger.getProductById(pid);
    if (product) {
      return res.json(product);
    }
    return res.status(404).json({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.post("/", async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await productManger.addProduct(product);
    return res.json({ message: "Producto agregado con exito", newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error interno del servidor", reason: error.message });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const currentProduct = await productManger.getProductById(pid);
    if (!currentProduct) {
      throw new Error("Producto no encontrado");
    }
    const productUpdate = req.body;
    const { title, price, description, thumbnail, code, stock, status } =
      productUpdate;
    if (
      !title ||
      !price ||
      !description ||
      !code ||
      !stock ||
      !status ||
      !thumbnail
    ) {
      throw new Error("Faltan campos obligatorios");
    }

    await productManger.udpateProduct(pid, productUpdate);
    return res.json({
      message: "Producto actualizado con exito",
      productUpdate,
    });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManger.getProductById(pid);
    await productManger.deleteProduct(pid);
    return res.json({ message: "Producto eliminado con exito" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor", reason: error.message });
  }
});
