import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const poiService = {
  poiUrl: serviceUrl,
  async createUser(user) {
    const res = await axios.post(`${this.poiUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.poiUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    try {
      const res = await axios.get(`${this.poiUrl}/api/users`);
      return res.data;
    } catch (e) {
      return null;
    }
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.poiUrl}/api/users`);
    return res.data;
  },

  async createPoi(poi) {
    const res = await axios.post(`${this.poiUrl}/api/poi`, poi);
    return res.data;
  },

  async getPoi(id) {
    const res = await axios.get(`${this.poiUrl}/api/poi/${id}`);
    return res.data;
  },

  async getAllPois() {
    const res = await axios.get(`${this.poiUrl}/api/pois`);
    return res.data;
  },

  async deleteAllPois() {
    const res = await axios.delete(`${this.poiUrl}/api/pois`);
    return res.data;
  },

  async deletePoi(id) {
    const res = await axios.delete(`${this.poiUrl}/api/poi/${id}`);
    return res.data;
  },

  async getPoisByCategory(category) {
    const res = await axios.get(`${this.poiUrl}/api/pois/category/${category}`);
    return res.data;
  },

  async authenticate(user) {
    const response = await axios.post(`${this.poiUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },
};
