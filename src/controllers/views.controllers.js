import ProductService from "../services/products.service.js";
import CartService from "../services/carts.service.js";
import TicketService from "../services/ticket.service.js";
import UserDto from "../dto/user.dto.js";
import { generateProducts } from "../utils/util.js";
import UsersService from "../services/users.service.js";

const productService = new ProductService();
const cartService = new CartService();
const ticketService = new TicketService();
const usersService = new UsersService();

class ViewsController {
  async getProducts(req, res) {
    let page = req.query.page;
    const limit = req.query.limit;
    const sort = req.query.sort || undefined;
    const category = req.query.category;
    

    const query = {};
    if (category) {
      query.category = category;
      page = 1;
    }

    try {
      const user = req.user;
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
      // VERRIFICAR SI EL USUARIO ESTA LOGUEADO
      const updatedUser = await usersService.findUser(user.email);

      const userDto = new UserDto(updatedUser);

      res.render("products", {
        status: "success",
        payload: productsFinal,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        currentPage: products.page,
        totalPages: products.totalPages,
        user: userDto,
        fileCss: "products.css",
        sort,
        categories: new Set(products.docs.map((product) => product.category)),
        query: req.query,
        category,
      });
    } catch (error) {
      req.logger.error("Error al obtener los productos", error);
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
      req.logger.error("Error al obtener los productos", error);
    }
  }

  async panelPremium(req, res) {
    try {
      const user = req.user;
      const updatedUser = await usersService.findUser(user.email);
      const userDto = new UserDto(updatedUser);
      res.render("panelPremium", {
        fileCss: "panelPremium.css",
        user: userDto,
      });
    } catch (error) {
      res.render("productError", { fileCss: "productError.css" });
      req.logger.error("Error al ingresar al panel premium", error);
    }
  }

  async chat(req, res) {
    try {
      res.render("chat", { fileCss: "chat.css", user: req.user });
    } catch (error) {
      res.render("productError", { fileCss: "productError.css" });
      req.logger.error("Error al ingresar al chat", error);
    }
  }

  async getCart(req, res) {
    const cartId = req.params.cid;

    try {
      const user = req.user;
      const carrito = await cartService.getCart(cartId);
      if (!carrito) {
        return res.render("productError");
      }

      const productosEnCarrito = carrito.products.map((item) => ({
        product: item.product.toObject(),
        quantity: item.quantity,
      }));
      const updatedUser = await usersService.findUser(user.email);

      const userDto = new UserDto(updatedUser);
      res.render("cart", {
        productos: productosEnCarrito,
        user: userDto,
        fileCss: "cart.css",
      });
    } catch (error) {
      req.logger.error("Error al obtener el carrito", error);
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

      const updatedUser = await usersService.findUser(user.email);

      const userDto = new UserDto(updatedUser);
      res.render("current", { fileCss: "profile.css", userDto });
    } catch (error) {
      req.logger.error("Error al obtener el usuario", error);
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
    } catch (error) {}
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

  async resetPassword(req, res) {
    res.render("passwordreset", { fileCss: "reset.pass.css" });
  }

  async changePassword(req, res) {
    res.render("changePassword", { fileCss: "changePassword.css" });
  }

  async sendEmail(req, res) {
    res.render("sendEmail", { fileCss: "sendEmail.css" });
  }

  async userNotFound(req, res) {
    res.render("userNotFound", { fileCss: "sendEmail.css" });
  }
  async invalidToken(req, res) {
    res.render("invalidToken", { fileCss: "sendEmail.css" });
  }

  async expiredToken(req, res) {
    res.render("expiredToken", { fileCss: "sendEmail.css" });
  }

  async passRepeatError(req, res) {
    res.render("passRepeatError", { fileCss: "sendEmail.css" });
  }

  async updatePassword(req, res) {
    res.render("updatePassword", { fileCss: "sendEmail.css" });
  }

  async premiumDocuments(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect("/login");
      }
      const userDto = new UserDto(user);

      res.render("premiumRol", { fileCss: "documentsPremium.css", userDto });
    } catch (error) {
      req.logger.error("Error al obtener los documentos premium", error);
      res.render("productError", { fileCss: "productError.css" });
    }
  }

  async usersList(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect("/login");
      }
      const updatedUser = await usersService.findUser(user.email);
      const userDto = new UserDto(updatedUser);
      const users = await usersService.getUsers();

      res.render("usersList", { fileCss: "usersList.css", userDto, users });
    } catch (error) {
      req.logger.error("Error al obtener la lista de usuarios", error);
      res.render("productError", { fileCss: "productList.css" });
    }
  }
}

export default ViewsController;
