import { Router } from "express";
import LoggerController from "../controllers/logger.controller.js";

const loggerController = new LoggerController();

export const loggerRouter = Router();

loggerRouter.get("/", loggerController.getLogs);
