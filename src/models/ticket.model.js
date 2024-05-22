import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true },
  purchase_date: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

export const ticketModel = mongoose.model("tickets", ticketSchema);

