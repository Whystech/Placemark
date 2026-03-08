import { Poi } from "./poi.js";

export const poiMongoStore = {
  async getAllPois() {
    const pois = await Poi.find().lean();
    return pois;
  },

  async addPoi(userId, poi) {
    poi.userid = userId;
    const newPoi = new Poi(poi);
    const poiObj = await newPoi.save();
    return this.getPoiById(poiObj._id);
  },

  async getPoisByUserId(id) {
    const pois = await Poi.find({ userid: id }).lean();
    return pois;
  },

  async getPoiById(id) {
    if (id) {
      const poi = await Poi.findOne({ _id: id }).lean();
      return poi;
    }
    return null;
  },

  async deletePoi(id) {
    try {
      await Poi.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPois() {
    await Poi.deleteMany({});
  },

  async getPoisByCategory(category) {
    const pois = await Poi.find({ category: category }).lean();
    return pois;
  },

  async updatePoi(poi, updatedPoi) {
    const poiDoc = await Poi.findOne({ _id: poi._id });
    poiDoc.name = updatedPoi.name;
    poiDoc.description = updatedPoi.description;
    poiDoc.latitude = updatedPoi.latitude;
    poiDoc.longitude = updatedPoi.longitude;
    poiDoc.category = updatedPoi.category;
    await poiDoc.save();
  },
};
