import passport from "passport";
import Handlebars from "handlebars";

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
    if (req.user.rol !== role) {
      return res.status(403).send({ error: "No tienes permisos suficientes" });
    }
    next();
  };
};

const unauthorizedRoute = () => {
  return function (req, res, next) {
    passport.authenticate("jwt", function (error, user) {
      if (user) {
        return res.redirect("/products");
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
    })
    (req, res, next);
  };
};

const handleBarsSet= ()=>{
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



}


const codeGenerator = () => {
  return new Date().getTime().toString(36).slice(-5);
}




export { passportCall, authorization ,unauthorizedRoute, unauthorizedRouteRedirectLogin,handleBarsSet,codeGenerator};
