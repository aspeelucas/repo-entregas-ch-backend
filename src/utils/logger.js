import winston from "winston";
import program from "./commander.js";

const {mode} = program.opts();

const config = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warn: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: config.levels,

  transports: [
    new winston.transports.Console({
      level: mode === "production" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: config.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./src/logs/errors.log",
      format: winston.format.simple(),
    }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `Request: ${req.method} ${
      req.originalUrl
    }- ${new Date().toLocaleTimeString()}`
  );
  next();
};

export default addLogger;
