import {ticketModel} from '../models/ticket.model.js';
import { codeGenerator } from '../utils/util.js';



class TicketService {
    async addTicket({ amount, purchaser }) {

        try {
        const code = codeGenerator();
       
        const purchase_date = new Date();
        const newTicket = new ticketModel({ amount , purchaser,code, purchase_date});
        const ticket = await newTicket.save();
        console.log("Ticket agregado con exito");
        return ticket;
        } catch (error) {
        console.log("Error al agregar ticket", error);
        throw error;
        }
    }
    async getTickets() {
        try {
        const tickets = await ticketModel.find();
        return tickets;
        } catch (error) {
        console.log(`Error al obtener los tickets ${error}`);
        throw error;
        }
    } 
}


export default TicketService;