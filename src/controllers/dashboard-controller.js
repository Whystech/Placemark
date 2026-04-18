import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const category = request.query.category;
      const loggedInUser = request.auth.credentials;

      let pois = await db.poiStore.getPoisByUserId(loggedInUser._id);
      pois.forEach(poi => {
        poi.latitude = poi.latitude.toFixed(2)
        poi.longitude = poi.longitude.toFixed(2)
      });

      if (category) {
        const categoryPois = [];
        pois.forEach((poi) => {
          if (poi.category === category) {
            categoryPois.push(poi);
          }
        });
        pois = categoryPois;
      }

      let publicPois = await db.poiStore.getAllPublicPois();

     for (const publicPoi of publicPois) {
        publicPoi.latitude = publicPoi.latitude.toFixed(2)
        publicPoi.longitude = publicPoi.longitude.toFixed(2)
        publicPoi.user = await db.userStore.getUserById(publicPoi.userid) // get some details about the user - even though an error shows up an this might not be the best way, it works.
      };
      
      if (category) {
        const publicCategoryPois = [];
        publicPois.forEach((poi) => {
          if (poi.category === category) {
            publicCategoryPois.push(poi);
          }
        });
        publicPois = publicCategoryPois;
      }

      const viewData = {
        title: "Placemarker Dashboard",
        user: loggedInUser,
        pois: pois,
        publicPois: publicPois,
      };

      return h.view("dashboard-view", viewData);
    },
  },
};
