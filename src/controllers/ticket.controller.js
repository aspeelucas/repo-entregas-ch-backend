import TicketService from "../services/ticket.service.js";
import CartService from "../services/carts.service.js";
import ProductService from "../services/products.service.js";
import { userModel } from "../models/user.model.js";

const ticketService = new TicketService();
const cartService = new CartService();
const productService = new ProductService();

class TicketController {
  async checkOut(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartService.getCart(cartId);
      const products = cart.products;
      console.log(products);

      const productsNotAvailable = [];

      for (const item of products) {
        const productId = item.product;
        const product = await productService.getProductById(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          productsNotAvailable.push(productId);
        }
      }

      const userWitchCart = await userModel.findOne({ cart: cartId });

      const newTicket = await ticketService.generateTicket(cart);

      cart.products = cart.products.filter((item) =>
        productsNotAvailable.some((id) => id != item.product)
      );
      await cart.save();

      res.render("check", {
        fileCss: "checkout.css",
        ticket: newTicket,
        cliente: userWitchCart.first_name,
        email: userWitchCart.email,
        numTicket: newTicket._id,
      });
     
    } catch (error) {
      res.status(400).send(`Error al realizar la compra :${error}`);
    }
  }

  async getTickets(req, res) {
    try {
      const { cid } = req.params;
      const tickets = await ticketService.getTicket(cid);
      res.status(200).send(tickets);
    } catch (error) {
      res.status(400).send(`Error al obtener los tickets ${error}`);
    }
  }
}

export default TicketController;
