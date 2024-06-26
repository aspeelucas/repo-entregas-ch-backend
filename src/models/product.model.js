
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  thumbnail: { type: [String]},
  category: { type: String, required: true },
  code: { type: Number, required: true , unique: true},
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true },
  owner:{  type: String,
    required: true,
    default: "admin"
   },
});
productSchema.plugin(mongoosePaginate);


export const productModel = mongoose.model("products", productSchema);