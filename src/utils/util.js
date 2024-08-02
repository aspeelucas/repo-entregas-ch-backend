import passport from "passport";
import Handlebars from "handlebars";
import { faker } from "@faker-js/faker";
import swaggerJSDoc from "swagger-jsdoc";
import UsersService from "../services/users.service.js";

const usersService = new UsersService();

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res
          .status(401)
          .send({ error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (role) => {

  return async (req, res, next) => {
    const user = await usersService.findUser(req.user.email);
    if (user.rol !== role ) {
      return res.status(403).send({ error: "No tienes permisos suficientes" });
    }
    next();
  };
};

const authorizationUsers = (role) => {
  return async (req, res, next) => {
    if (req.user.rol == role || req.user.rol == "admin") {
      return res.status(403).send({ error: "No tienes permisos suficientes" });
    }
    next();
  };
};

const unauthorizedRoute = () => {
  return function (req, res, next) {
    passport.authenticate("jwt", function (error, user) {
      if (user) {
        return res.redirect("/current");
      }
      next();
    })(req, res, next);
  };
};

const unauthorizedRouteRedirectLogin = () => {
  return function (req, res, next) {
    passport.authenticate("jwt", function (error, user) {
      if (!user) {
        return res.redirect("/login");
      }
      next();
    })(req, res, next);
  };
};

const handleBarsSet = () => {
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

  Handlebars.registerHelper("multiply", function (a, b) {
    return a * b;
  });
};

const codeGenerator = () => {
  return new Date().getTime().toString(36).slice(-5);
};

// Faker Mock

const generateProducts = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: parseInt(faker.commerce.price({ min: 1000, max: 2000, dec: 0 })),
    thumbnail: faker.image.avatar(),
    code: codeGenerator(),
    stock: parseInt(faker.string.numeric()),
    status: true,
  };
};

// swagger configuration

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion sobre top e-commerce",
      description: "Documentacion de la API de top e-commerce",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);



export {
  passportCall,
  authorization,
  unauthorizedRoute,
  unauthorizedRouteRedirectLogin,
  handleBarsSet,
  codeGenerator,
  generateProducts,
  authorizationUsers,
  specs,
};
