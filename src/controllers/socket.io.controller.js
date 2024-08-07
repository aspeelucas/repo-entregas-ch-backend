import { messageModel } from "../models/message.model.js";
import ProductService from "../services/products.service.js";
import { Server } from "socket.io";

const productService = new ProductService();

const productDefault = async (req, res) => {
  const limit = 20;
  const products = await productService.getProducts(limit);
  const productsFinal = products.docs.map((product) => {
    const { ...rest } = product.toObject();
    return rest;
  });
  return productsFinal;
};

const socketController = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado!");

    // Get all products
    socket.emit("allProducts", await productDefault());

    // Get one product
    socket.on("get-product", async (_id) => {
      const product = await productService.getProductById(_id);
      socket.emit("product", product);
    });

    socket.on("ownerPro", async (email) => {
      const products = await productService.getProductsByOwner(email.email);
      const productsFinal = products.map((product) => {
        const { ...rest } = product.toObject();
        return rest;
      });

      socket.emit("allProductsOwner", productsFinal);
    });

    // Add product
    socket.on("new-product", async (data) => {
      console.log(data);

      data.price = Number(data.price);
      data.code = Number(data.code);
      data.stock = Number(data.stock);

      try {
        await productService.addProduct(data);
        socket.emit("allProducts", await productDefault());
      } catch (error) {
        console.error("Error al agregar producto", error);
      }
    });

    // Update product
    socket.on("update-product", async ({ id, data }) => {
      data.price = Number(data.price);
      data.code = Number(data.code);
      data.stock = Number(data.stock);
      console.log(data, id);

      try {
        await productService.udpateProduct(id, data);
        socket.emit("allProducts", await productDefault());
      } catch (error) {
        console.error("Error al actualizar producto", error);
      }
    });

    // Delete product
    socket.on("delete-product", async (_id) => {
      try {
        await productService.deleteProduct(_id);
        socket.emit("allProducts", await productDefault());
      } catch (error) {
        console.error("Error al eliminar producto", error);
      }
    });

    // Delete owner products
    socket.on("delete-owner-products", async ({ _id, email }) => {
      try {
        await productService.deleteProduct(_id);
        const products = await productService.getProductsByOwner(email);
        const productsFinal = products.map((product) => {
          const { ...rest } = product.toObject();
          return rest;
        });
        socket.emit("allProductsOwner", productsFinal);
      } catch (error) {
        console.error("Error al eliminar producto", error);
      }
    });

    // Update owner products
    socket.on("update-product", async ({ id, data }) => {
      data.price = Number(data.price);
      data.code = Number(data.code);
      data.stock = Number(data.stock);
      console.log(data, id);

      try {
        await productService.udpateProduct(id, data);
        const products = await productService.getProductsByOwner(data.owner);
        const productsFinal = products.map((product) => {
          const { ...rest } = product.toObject();
          return rest;
        });
        socket.emit("allProductsOwner", productsFinal);
      } catch (error) {
        console.error("Error al actualizar producto", error);
      }
    });

    // Chat
    socket.on("message", async (data) => {
      await messageModel.create(data);

      const messages = await messageModel.find({}).lean();

      io.emit("messageLogs", messages);
    });
  });
};

export default socketController;
