import { userMemStore } from "./mem/user-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { userMongoStore } from "../controllers/mongo/user-mongo-store.js";
import { connectMongo } from "../controllers/mongo/connect.js";
import { poiJsonStore } from "./json/poi-json-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";

export const db = {
  userStore: null,
  poiStore: null,

  init(storeType) {
    switch ("mongo") {
      case "json" :
        this.userStore = userJsonStore;
        this.poiStore = poiJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.poiStore = poiMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.poiStore = poiMemStore;
    }
  }
};
