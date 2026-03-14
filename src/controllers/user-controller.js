import { db } from "../models/db.js";
import { accountsController } from "./accounts-controller.js";

// Code previously used in the weather app assignment
export const userController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "User Settings",
        userEmail: loggedInUser.email,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        password: loggedInUser.password,
        id: loggedInUser._id,
      };
      console.log("User settings rendering");
      return h.view("user-view", viewData);
    },
  },

  updateDetails: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const id = loggedInUser._id;
      const userBlueprint = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
      };
      await db.userStore.updateDetails(id, userBlueprint);
      console.log(`Updating details for user ${id}`);
      return h.redirect("/userdetails");
    },
  },

  updatePassword: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const id = loggedInUser._id;
      const currentPassword = loggedInUser.password;
      const newPassword = request.payload.newPassword;
      const newPasswordCheck = request.payload.newPasswordCheck;
      const passwordCheck = request.payload.oldPasswordCheck;

      if (passwordCheck !== currentPassword) {
        console.log(`Current password invalid for user ${id}`);
        return h.redirect("/userdetails");
      }

      if (newPassword !== newPasswordCheck) {
        console.log("Password confirmation does not match");
        return h.redirect("/userdetails");
      }

      await db.userStore.updatePassword(id, newPassword);
      console.log(`Updating password for user ${id}`);
      return h.redirect("/userdetails");
    },
  },
};
