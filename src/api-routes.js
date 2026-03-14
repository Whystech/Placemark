import { userApi } from "./api/user-api.js";
import { poiApi } from "./api/poi-api.js"

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

  { method: "GET", path: "/api/pois", config: poiApi.find },
  { method: "GET", path: "/api/poi/{id}", config: poiApi.findOne },
  { method: "POST", path: "/api/poi", config: poiApi.create },
  { method: "DELETE", path: "/api/pois", config: poiApi.deleteAll },
  { method: "DELETE", path: "/api/poi/{id}", config: poiApi.deleteOne },
  { method: "GET", path: "/api/pois/category/{category}", config: poiApi.findByCategory },
];
