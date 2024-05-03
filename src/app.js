import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { productsRouter } from "./router/productsRouter.js";
import { cartRouter } from "./router/cartRouter.js";
import { sessionsRouter } from "./router/sessionsRouter.js";
import { viewRouter } from "./router/viewsRouter.js";
import { ProductManager } from "./controllers/products-manager.js";
import { messageModel } from "./models/message.model.js";
import { connectDb } from "./database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import Handlebars from "handlebars";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";


connectDb();

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const productManger = new ProductManager();
const productDefault = async () => {
  const products = await productManger.getProducts(999);
  const productsFinal = products.docs.map((product) => {
    const { ...rest } = product.toObject();
    return rest;
  });
  return productsFinal;
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewRouter);


// Socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  // Get all products
  socket.emit("allProducts", await productDefault());

  // Add product

  socket.on("new-product", async (data) => {
    console.log(data);

    data.price = Number(data.price);
    data.code = Number(data.code);
    data.stock = Number(data.stock);

    try {
      await productManger.addProduct(data);
      socket.emit("allProducts", await productDefault());
    } catch (error) {
      console.log(error);
    }
  });

  // Delete product
  socket.on("delete-product", async (_id) => {
    try {
      await productManger.deleteProduct(_id);
      socket.emit("allProducts", await productDefault());
    } catch (error) {
      console.log(error);
    }
  });

  // Chat
  socket.on("message", async (data) => {
    await messageModel.create(data);

    const messages = await messageModel.find({}).lean();

    io.emit("messageLogs", messages);
  });
});

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
Handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a === b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

Handlebars.registerHelper("getUpdatedQuery", function (a, b, opts) {
  const result = Object.entries(a)
    .map((query) => {
      if (query[0].includes(b)) {
        return "";
      }

      return query.join("=");
    })
    .join("&");

  return result;
});
