import { db } from "../models/db.js";
import dotenv from "dotenv";

export const adminController = {
  adminIndex: {
    handler: async function (request, h) {
      let users = await db.userStore.getAllUsers();
      users = users.filter((u) => u.email !== process.env.adminuser); // filter admin out
      let pois = await db.poiStore.getAllPois();
      let categoryPois = [];
      const category = request.query.category; // switched from params to query
      console.log(category);
      if (category) {
        pois.forEach((poi) => {
          if (poi.category === category) {
            categoryPois.push(poi);
            console.log(poi.category);
          }
        });
        pois = categoryPois;
      }
      const viewData = {
        name: "Admin",
        title: "Admin Dashboard",
        users: users,
        pois: pois,
      };
      return h.view("admin-view", viewData);
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id)
      const userId = user._id
      await db.userStore.deleteUserById(userId);
      return h.redirect("/admin-view");
    },
  },
};
