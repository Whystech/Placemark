import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      let categoryPois = [];
      const category = request.query.category; // switched from params to query
      console.log(category)
      const loggedInUser = request.auth.credentials;
      let pois = await db.poiStore.getPoisByUserId(loggedInUser._id);
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
        title: "Placemarker Dashboard",
        user: loggedInUser,
        pois: pois,
      };
      return h.view("dashboard-view", viewData);
    },
  },
};
