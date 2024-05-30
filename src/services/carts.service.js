import { cartModel } from "../models/cart.model.js";
import { getErrorInfo } from "./errors/info.js";
import CustomError from "./errors/custom-error.js";
import { EErrors } from "./errors/enum.js";

class CartService {
  async addCart(user) {
    try {
      const cart = new cartModel({ products: [], user });
      if (!cart) {
        throw CustomError.createError({
          name: "Carritos no creado",
          source: getErrorInfo({}, 5),
          message: "Error al crear un carrito",
          code: EErrors.DB_ERROR,
        });
      }
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
        (item) => item.product._id.toString() === productId
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
      if (!carts) {
        throw CustomError.createError({
          name: "Carritos no encontrados",
          source: getErrorInfo({}, 5),
          message: "Error al obtener los carritos",
          code: EErrors.DB_ERROR,
        });
      }
      return carts;
    } catch (error) {
      console.log(`Error al obtener los carritos ${error}`);
      throw error;
    }
  }
  async getCart(id) {
    try {
      const cart = await cartModel.findById(id);

      if (!cart) {
        throw CustomError.createError({
          name: "Carrito no encontrado",
          source: getErrorInfo({ id }, 6),
          message: "Error al obtener el carrito",
          code: EErrors.NOT_FOUND,
        });
      }
      return cart;
    } catch (error) {
      console.log(`Error al obtener el carrito ${error}`);
      throw error;
    }
  }

  async udpateProductFromCart(cartId, updatedProducts) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw CustomError.createError({
          name: "Carrito no encontrado",
          source: getErrorInfo({ id: cartId }, 6),
          message: "Error al obtener el carrito",
          code: EErrors.NOT_FOUND,
        });
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

  async updateCart(cid, updatedProducts) {
    try {
      const cart = await this.getCart(cid);

      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw CustomError.createError({
          name: "Carrito no encontrado",
          source: getErrorInfo({ id: cartId }, 6),
          message: "Error al obtener el carrito",
          code: EErrors.NOT_FOUND,
        });
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
      if (!cart) {
        throw CustomError.createError({
          name: "Carrito no encontrado",
          source: getErrorInfo({ id }, 6),
          message: "Error al eliminar todos los productos del carrito",
          code: EErrors.NOT_FOUND,
        });
      }
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

  async deleteCart(id) {
    try {
      const cart = await cartModel.findByIdAndDelete(id);
      if (!cart) {
        throw CustomError.createError({
          name: "Carrito no encontrado",
          source: getErrorInfo({ id }, 6),
          message: "Error al eliminar un carrito",
          code: EErrors.NOT_FOUND,
        });
      }
      console.log("Carrito eliminado con exito");
      return cart;
    } catch (error) {
      console.log(`Error al eliminar el carrito ${error}`);
      throw error;
    }
  }
}

export default CartService;
