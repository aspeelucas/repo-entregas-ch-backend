import CartService from "../services/carts.service.js";
const cartService = new CartService();

class CartController {
  // Obtiene todos los carritos
  async getCarts(req, res) {
    try {
      const carts = await cartService.getCarts();
      return res.json(carts);
    } catch (error) {
      console.error("Error al obtener los carritos", error);
      return res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  // Obtiene un carrito por id

  async getCart(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cartService.getCart(cid);
      return res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }
  }
  // Agrega un producto a un carrito

  async addProductToCart(req, res) {
    const { pid, cid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
      await cartService.addProductToCart(cid, pid, quantity);
      const updatedCart = await cartService.getCart(cid);
      return res.json({
        message: "El producto fue agregado con exito",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      return res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  // Actualiza productos de un carrito

  async updateProductFromCart(req, res) {
    const { cid } = req.params;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartService.udpateProductFromCart(
        cid,
        updatedProducts
      );
      return res.json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      return res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  // Elimina un producto de un carrito

  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const updatedCart = await cartService.deleteProductFromCart(cid, pid);
      return res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      return res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  // Elimina todos los productos de un carrito

  async deleteAllProductsFromCart(req, res) {
    const { cid } = req.params;
    try {
      await cartService.deleteAllProductsFromCart(cid);
      return res.json({
        status: "success",
        message: "Todos los productos fueron eliminados del carrito",
      });
    } catch (error) {
      console.error("Error al eliminar todos los productos del carrito", error);
      return res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
    // Agrega un carrito

    async addCart(req, res) {
      try {
        const cartId = await cartService.addCart();
        return res.json({ message: "El carrito fue agregado con exito", cartId });
      } catch (error) {
        console.log("Error al agregar carrito", error);
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    // Elimina un carrito

    async deleteCart(req, res) {
      const { cid } = req.params;
      try {
        await cartService.deleteCart(cid);
        return res.json({ status: "success", message: "Carrito eliminado con exito" });
      } catch (error) {
        console.error("Error al eliminar el carrito", error);
        return res.status(500).json({ status: "error", error: "Error interno del servidor" });
      }
    }

  // Finalizar compra

  async finishPurchase(req, res) {

    const { cid } = req.params;
    try {
      await cartService.finishPurchase(cid);
      return res.json({ status: "success", message: "Compra finalizada con exito" });
    } catch (error) {
      console.error("Error al finalizar la compra", error);
      return res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }

  }


}

export default CartController;
