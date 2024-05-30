import ProductService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import TicketService from "../services/ticket.service.js";
import UserDto from "../dto/user.dto.js";
import { generateProducts } from "../utils/util.js";


const productService = new ProductService();
const cartService = new CartService();
const ticketService = new TicketService();

class ViewsController {
  async getProducts(req, res) {
    const page = req.query.page;
    const limit = req.query.limit;
    const sort = req.query.sort || undefined;
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    try {
      const products = await productService.getProducts(
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
    } catch (error) {
      console.log("error al obtener productos ", error);
      res.render("productError", { fileCss: "productError.css" });
    }
  }

  async getRealTimeProducts(req, res) {
    try {
      res.render("realTimeProducts", {
        fileCss: "realTimeProducts.css",
        user: req.user,
      });
    } catch (error) {
      res.render("productError", { fileCss: "productError.css" });
      console.log("error al obtener productos ", error);
    }
  }

  async chat(req, res) {
    try {
      res.render("chat", { fileCss: "chat.css", user: req.user});
    } catch (error) {
      res.render("productError", { fileCss: "productError.css" });
      console.log("error al obtener productos ", error);
    }
  }

  async getCart(req, res) {
    const cartId = req.params.cid;

    try {
      const carrito = await cartService.getCart(cartId);
      if (!carrito) {
        return res.render("productError");
      }

      const productosEnCarrito = carrito.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));

      res.render("cart", {
        productos: productosEnCarrito,
        user: req.user,
        fileCss: "cart.css",
      });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      return res.render("productError", { fileCss: "productError.css" });
    }
  }

  async register(req, res) {
    res.render("register", { fileCss: "register.css" });
  }

  async login(req, res) {
    res.render("login", { fileCss: "login.css" });
  }

  async currentUser(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect("/login");
      }
      const userDto = new UserDto(user);
      res.render("current", { fileCss: "profile.css", userDto });
    } catch (error) {
      console.error("Error al obtener el usuario", error);
      return res.render("productError", {
        fileCss: "productError.css",
        user: req.user,
      });
    }
  }

  async checkout(req, res) {
    try {
      const { cid } = req.params;
      const findTicket = await ticketService.getTicket(cid);
      if (!findTicket) {
        return res.render("productError", { fileCss: "productError.css" });
      }
      res.render("checkout", { fileCss: "checkout.css", ticket: findTicket });  
    } catch (error) {
      
    }
  }

  async mockingProducts(req, res) {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }

    res.render("mockingProducts", {
      status: "success",
      payload: products,
      fileCss: "mock.css",
    });
  }
}

export default ViewsController;
