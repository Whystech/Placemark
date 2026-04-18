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
      const viewData = {
        title: "View Public Poi",
        poi: poi,
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
    const poi = await db.poiStore.getPoiById(request.params.id);
    const author = request.auth.credentials
    const comment = {
      title : request.payload.title,
      text : request.payload.text,
      authorId: author._id,
      author: author.firstName,
    }
    await db.poiStore.addPoiComment(poi._id, comment)
    return h.redirect("/public-poi/view/" + poi._id)
    },
  }
};
