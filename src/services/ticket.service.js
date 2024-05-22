import { ticketModel } from "../models/ticket.model.js";
import { codeGenerator } from "../utils/util.js";

class TicketService {


  async generateTicket(cart) {
    const code = codeGenerator();
    try {
      if (cart.products[0] != null) {
        const amount = cart.products.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );

        let newTicket = new ticketModel({
          code: code,
          purchase_date: Date.now(),
          amount,
          purchaser: cart.user,
        });

        await newTicket.save();
        console.log("Ticket generado con exito" + newTicket) ;
        return newTicket;
      } else {
        throw new Error(`No hay productos con suficiente stock en el carrito`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getTicket(id) {
    try {
      const ticket = await ticketModel.findById(id).lean();
      console.log("Ticket encontrado");
      return ticket;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export default TicketService;
