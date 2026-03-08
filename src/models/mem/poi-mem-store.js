import { v4 } from "uuid";

let pois = [];

export const poiMemStore = {
  async getAllPois() {
    return pois;
  },

  async addPoi(poi) {
    poi._id = v4();
    pois.push(poi);
    return poi;
  },

  async getPoiById(id) {
    let foundPoi = pois.find((poi) => poi._id === id);
    if (!foundPoi) {
      foundPoi = null;
    }
    return foundPoi;
  },

  async getPoisByCategory(category) {
    return pois.filter((poi) => poi.category === category);
  },

  async deletePoi(id) {
    const index = pois.findIndex((poi) => poi._id === id);
    if (index !== -1) pois.splice(index, 1);
  },

  async deleteAllPois() {
    pois = [];
  },

  async updatePoi(poi, updatedPoi) {
    poi.name = updatedPoi.name;
    poi.latitude = updatedPoi.latitude;
    poi.longitude = updatedPoi.longitude;
    poi.category = updatedPoi.category;
    poi.description = updatedPoi.description;
  },
};