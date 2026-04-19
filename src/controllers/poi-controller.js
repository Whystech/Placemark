import { PoiSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const poiController = {
  index: {
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      const viewData = {
        title: "Update Poi",
        poi: poi,
      };
      return h.view("poi-view", viewData);
    },
  },

  publicIndex: {
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      // Average rating calculation
      let ratingSum = 0;
      let averageRating = 0 
      let numberOfRatings = 0;
      if (!poi || !poi.ratings || poi.ratings.length === 0){
        averageRating = 0;
        numberOfRatings = 0;
      }
      for (const rating of poi.ratings) {
        ratingSum += rating.value;
      }
      averageRating = ratingSum / poi.ratings.length
      numberOfRatings = poi.ratings.length
      const viewData = {
        title: "View Public Poi",
        poi: poi,
        averageRating: averageRating,
        numberOfRatings: numberOfRatings
      };
      return h.view("public-poi-view", viewData);
    },
  },

  update: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("poi-view", { title: "Edit Poi error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      const newPoi = {
        name: request.payload.name,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        summary: request.payload.summary,
        category: request.payload.category,
        isPrivate: request.payload.isPrivate,
      };
      await db.poiStore.updatePoi(poi, newPoi);
      return h.redirect("/poi/edit/" + poi._id);
    },
  },

  addPoi: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Poi error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPoi = {
        userid: loggedInUser._id,
        name: request.payload.name,
        description: request.payload.description,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        summary: request.payload.summary,
        category: request.payload.category,
        isPrivate: request.payload.isPrivate,
      };
      await db.poiStore.addPoi(newPoi);
      return h.redirect("/dashboard");
    },
  },

  deletePoi: {
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      await db.poiStore.deletePoi(poi._id);
      return h.redirect("/dashboard");
    },
  },

  addComment: {
    handler: async function (request, h) {
      // Get the POI
      const poi = await db.poiStore.getPoiById(request.params.id);
      // Get current user
      const author = request.auth.credentials;
      const comment = {
        title: request.payload.title,
        text: request.payload.text,
        authorId: author._id,
        author: author.firstName,
      };
      // Push comment into POI comment array
      await db.poiStore.addPoiComment(poi._id, comment);
      return h.redirect("/public-poi/view/" + poi._id);
    },
  },

  addRating: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      const poiId = request.params.id;
      const ratingValue = Number(request.payload.ratingValue);
      await db.poiStore.addOrUpdateRating(poiId, user._id, ratingValue);
      return h.redirect("/public-poi/view/" + poiId);
    },
  },
};
