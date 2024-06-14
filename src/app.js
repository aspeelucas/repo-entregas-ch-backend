import express from "express";
import handlebars from "express-handlebars";
import { productsRouter } from "./router/productsRouter.js";
import { cartRouter } from "./router/cartRouter.js";
import { sessionsRouter } from "./router/sessionsRouter.js";
import { viewRouter } from "./router/viewsRouter.js";
import { loggerRouter } from "./router/loggerRouter.js";
import "./database.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import socketController from "./controllers/socket.io.controller.js";
import { handleBarsSet } from "./utils/util.js";
import compression from "express-compression";
import addLogger from "./utils/logger.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(compression());
app.use(addLogger);

// passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/loggertest", loggerRouter);
app.use("/", viewRouter);




// Socket.io
socketController(httpServer);

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

handleBarsSet();
