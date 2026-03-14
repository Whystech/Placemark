import dotenv from "dotenv"; //   for admin password
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

dotenv.config();
export const accountsController = {
  index: {
    
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemarker" });
    },
  },
  login: {
    auth: false,
      validate: {
        payload: UserCredentialsSpec,
        options: { abortEarly: false },
        failAction: function (request, h, error) {
          return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
        },
      },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      // Admin login
      if (email === process.env.adminuser) {
        if (password === process.env.adminpassword){
          request.cookieAuth.set({ id: user._id });
          return h.redirect("/admin-view");}
        else {
          return h.view("login-error");}
        }
    
      if (!user || user.password !== password) {
        return h.view("login-error");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
