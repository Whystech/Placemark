import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PoiSpec, PoiSpecPlus, PoiArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const poiApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function () {
      try {
        const pois = await db.poiStore.getAllPois();
        return pois;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PoiArraySpec, failAction: validationError },
    description: "Get all POIs",
    notes: "Returns all POIs",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
        if (!poi) {
          return Boom.notFound("No POI with this id");
        }
        return poi;
      } catch (err) {
        return Boom.serverUnavailable("No POI with this id");
      }
    },
    tags: ["api"],
    description: "Find a POI",
    notes: "Returns a POI",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PoiSpecPlus, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.addPoi(request.payload);
        if (poi) {
          return h.response(poi).code(201);
        }
        return Boom.badImplementation("error creating poi");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a POI",
    notes: "Returns the newly created POI",
    validate: { payload: PoiSpec },
    response: { schema: PoiSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.poiStore.deleteAllPois();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all POIs",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const poi = await db.poiStore.getPoiById(request.params.id);
        if (!poi) {
          return Boom.notFound("No POI with this id");
        }
        await db.poiStore.deletePoi(poi._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No POI with this id");
      }
    },
    tags: ["api"],
    description: "Delete a POI",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  findByCategory: {
    auth: {
      strategy: "jwt",
    },

    async handler(request) {
      try {
        const pois = await db.poiStore.getPoisByCategory(request.params.category);
        return pois;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },

    tags: ["api"],
    description: "Get POIs by category",
    notes: "Returns POIs filtered by category",
    response: { schema: PoiArraySpec, failAction: validationError },
  },
};