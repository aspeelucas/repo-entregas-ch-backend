import { cartModel } from "../models/cart.model.js";

export class CartManager {
  async addCart() {
    try {
      const cart = new cartModel({ products: [] });
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al agregar carrito", error);
      throw error;
    }
  }

  async addProductToCart(id, productId, quantity = 1) {
    try {
      const cart = await this.getCart(id);
      const productExist = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (productExist) {
        productExist.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al agregar producto al carrito", error);
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.log(`Error al obtener los carritos ${error}`);
      throw error;
    }
  }
  async getCart(id) {
    try {
      const cart = await cartModel.findById(id);

      if (cart) {
        return cart;
      } else {
        console.log(`El carrito con el id ${id} no existe`);
        throw new Error(`Not Found`);
      }
    } catch (error) {
      console.log(`Error al obtener el carrito ${error}`);
      throw error;
    }
  }

  async udpateProductFromCart(cartId, updatedProducts) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = updatedProducts;

      cart.markModified("products");

      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito en el gestor", error);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito ", error);
      throw error;
    }
  }

  async deleteAllProductsFromCart(id) {
    try {
      const cart = await this.getCart(id);
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      console.log("Todos los productos fueron eliminados del carrito");
      return cart;
    } catch (error) {
      console.log(`Error al eliminar todos los productos del carrito ${error}`);
      throw error;
    }
  }
}
