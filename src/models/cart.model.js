import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   products: [
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, required: true }
    }
   ]
});

cartSchema.pre('findOne', function(next){
    this.populate('products.product');
    next();
})

export const cartModel = mongoose.model("carts", cartSchema);