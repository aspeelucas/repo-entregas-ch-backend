import ProductService from "../services/products.service.js";
const productService = new ProductService();
import CustomError from "../services/errors/custom-error.js";
import { EErrors } from "../services/errors/enum.js";
import { getErrorInfo } from "../services/errors/info.js";

class ProductController {
  async addProduct(req, res) {
    const product = req.body;
    try {
      const newProduct = await productService.addProduct(product);
      return res.json({ message: "Producto agregado con exito", newProduct });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error interno del servidor", reason: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;
      const products = await productService.getProducts(
        limit,
        page,
        sort,
        query
      );
      req.logger.info("Productos obtenidos correctamente");
      return res.json({
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
      req.logger.error("Error al obtener los productos", error);
      res
        .status(500)
        .json({ status: "error", error: "Error interno del servidor" });
    }
  }

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);
      if (product) {
        req.logger.info(`Producto obtenido correctamente ${product}`);
        return res.json(product);
      }
      req.logger.error("Producto no encontrado");
      return res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const currentProduct = await productService.getProductById(pid);
      if (!currentProduct) {
        throw new Error("Producto no encontrado");
      }
      const productUpdate = req.body;
      const {
        title,
        price,
        description,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = productUpdate;
      if (
        !title ||
        !price ||
        !description ||
        !code ||
        !stock ||
        !status ||
        !thumbnail ||
        !category
      ) {
        throw CustomError.createError({
          name: "Datos incompletos o no validos",
          source: getErrorInfo(
            {
              title,
              price,
              description,
              thumbnail,
              code,
              stock,
              status,
              category,
            },
            9
          ),
          message: "Datos incompletos o no validos",
          code: EErrors.BAD_REQUEST,
        });
      }

      await productService.udpateProduct(pid, productUpdate);
      req.logger.info(`Producto actualizado con exito`);
      return res.json({
        message: "Producto actualizado con exito",
        productUpdate,
      });
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { pid } = req.params;
    try {
      await productService.getProductById(pid);
      await productService.deleteProduct(pid);
      req.logger.info(`Producto eliminado con exito`);
      return res.json({ message: "Producto eliminado con exito" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error interno del servidor", reason: error.message });
    }
  }
}

export default ProductController;
