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
      const productsNotAvailable = [];

      for (const item of products) {
        const productId = item.product;
        const product = await productService.getProductById(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          productsNotAvailable.push({
            product: productId,
            quantity: item.quantity,
          });
        }
      }
      const productsAvailables = cart.products.filter((item) =>
        productsNotAvailable.every(
          ({ product }) => product._id != item.product._id
        )
      );
      

      const newTicket = await ticketService.generateTicket(
        productsAvailables,
        cart.user
      );

      cart.products = productsNotAvailable;

      await cart.save();
      return res.json(newTicket);
    } catch (error) {
      res.status(400).send(`Error al realizar la compra :${error}`);
    }
  }

  async getTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const tickets = await ticketService.getTicket(ticketId);
      res.status(200).send(tickets);
    } catch (error) {
      res.status(400).send(`Error al obtener los tickets ${error}`);
    }
  }
}

export default TicketController;
