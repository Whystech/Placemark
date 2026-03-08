import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const poiJsonStore = {
  async getAllPois() {
    await db.read();
    return db.data.pois;
  },

  async addPoi(poi) {
    await db.read();
    poi._id = v4();
    db.data.pois.push(poi);
    await db.write();
    return poi;
  },

  async getPoiById(id) {
    await db.read();
    let p = db.data.pois.find((poi) => poi._id === id);
    if (p === undefined) p = null;
    return p;
  },

  async getPoisByCategory(category) {
    await db.read();
    let p = db.data.pois.filter((poi) => poi.category === category);
    if (p === undefined) p = null;
    return p;
  },

  async deletePoi(id) {
    await db.read();
    const index = db.data.pois.findIndex((poi) => poi._id === id);
    if (index !== -1) db.data.pois.splice(index, 1);
    await db.write();
  },

  async deleteAllPois() {
    db.data.pois = [];
    await db.write();
  },

  async updatePoi(poi, updatedPoi) {
    poi.name = updatedPoi.name;
    poi.latitude = updatedPoi.latitude;
    poi.longitude = updatedPoi.longitude;
    poi.category = updatedPoi.category;
    poi.description = updatedPoi.description;
    await db.write();
  },
};
