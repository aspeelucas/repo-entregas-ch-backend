import passport from "passport";

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
    })(req, res, next);
  };
};


export { passportCall, authorization ,unauthorizedRoute, unauthorizedRouteRedirectLogin};
