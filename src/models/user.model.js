import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true
  },
  age: {
    type: Number,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
  cart: {
    type: String,
  },
  resetToken: {
    token: String,
    expiresAt: Date,
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
  },
  last_connection: {
    type: Date,
  },
});

export const userModel = mongoose.model("users", userSchema);
