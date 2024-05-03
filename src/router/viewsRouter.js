import { Router } from "express";
import { ProductManager } from "../controllers/products-manager.js";
import { CartManager } from "../controllers/carts-manager.js";
import passport from "passport";
import { unauthorizedRoute,unauthorizedRouteRedirectLogin } from "../utils/util.js";

const productManger = new ProductManager();
const cartManager = new CartManager();

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  res.redirect("/login");
});

viewRouter.get(
  "/realtimeproducts",
  unauthorizedRouteRedirectLogin(),
  async (req, res) => {
    try {
      res.render("realTimeProducts", {
        fileCss: "realTimeProducts.css",
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      console.log("error al obtener productos ", error);
    }
  }
);

viewRouter.get(
  "/chat",
  unauthorizedRouteRedirectLogin(),
  async (req, res) => {
    try {
      res.render("chat", { fileCss: "chat.css" });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
      console.log("error al obtener productos ", error);
    }
  }
);

viewRouter.get(
  "/products",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const sort = req.query.sort || undefined;
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    try {
      const products = await productManger.getProducts(
        limit,
        page,
        sort,
        query
      );

      const productsFinal = products.docs.map((product) => {
        const { ...rest } = product.toObject();
        return rest;
      });

      if (!products || page > products.totalPages || page < 1) {
        return res.render("productError", { fileCss: "productError.css" });
      }

      res.render("products", {
        status: "success",
        payload: productsFinal,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        currentPage: products.page,
        totalPages: products.totalPages,
        user: req.user,
        fileCss: "products.css",
        sort,
        categories: ["electrodomestico", "computadoras", "celulares"],
        query: req.query,
        category,
      });
    } catch (error) {}
  }
);

viewRouter.get(
  "/carts/:cid",
  unauthorizedRouteRedirectLogin(),
  async (req, res) => {
    const cartId = req.params.cid;

    try {
      const carrito = await cartManager.getCart(cartId);
      if (!carrito) {
        return res.render("productError");
      }

      const productosEnCarrito = carrito.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));

      res.render("cart", {
        productos: productosEnCarrito,
        user: req.session.user,
        fileCss: "cart.css",
      });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      return res.render("productError");
    }
  }
);

// Rutas de autenticación

viewRouter.get("/register", unauthorizedRoute(), async (req, res) => {
  res.render("register", { fileCss: "register.css" });
});

viewRouter.get("/login", unauthorizedRoute(), async (req, res) => {
  res.render("login", { fileCss: "login.css" });
});
