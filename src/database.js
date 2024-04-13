import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect("mongodb+srv://aspeelucas:1D4amlIQuSpEfW4E@backend.iwzkkok.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=backend");
    console.log("Database connected");
  } catch (error) {
    console.log("Error in conection", error);
  }
}
