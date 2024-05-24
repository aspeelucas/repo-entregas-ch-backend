import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GithubStrategy from "passport-github2";

import { Strategy as LocalStrategyJwt, ExtractJwt } from "passport-jwt";
import { userModel } from "../models/user.model.js";
import { isValidPassword, createHash } from "../utils/hashbcrypt.js";
import CartService from "../services/carts.service.js";


const cartService = new CartService();

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body;
        try {
          const userExists = await userModel.findOne({
            email: email,
          });
          if (userExists) {
            return done(null, false);
          } else {
            const rol =
              email === "adminCoder@coder.com" && password === "adminCod3r123"
                ? "admin"
                : "user";

            const newUser = {
              first_name,
              last_name,
              email,
              password: createHash(password),
              age,
              rol,
            };

            const user = await userModel.create(newUser);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email: email });
          if (!user) {
            console.log("Usuario no encontrado");
            return done(null, false);
          } else if (isValidPassword(password, user) === false) {
            console.log("Contraseña incorrecta");
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });

  // estrategia de github

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.e920d23de27c1930",
        clientSecret: "8a68f0024daaedcdae76e96f9a6803a4a2c5f853",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refeshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (user) {
            return done(null, user);
          } else {
            const cart = await cartService.addCart(user.email);
            const newUser = {
              first_name: profile._json.name,
              last_name: "Github",
              age: 18,
              email: profile._json.email,
              password: "",
              cart: cart._id,
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // estrategia jwt

  passport.use(
    "jwt",
    new LocalStrategyJwt(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "secretTokenPrivate",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookie"];
  }
  return token;
};

export default initializePassport;
