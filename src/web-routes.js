import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { dashboardController} from "./controllers/dashboard-controller.js";
import { poiController} from "./controllers/poi-controller.js"
import { userController } from "./controllers/user-controller.js";

export const webRoutes = [
// Account controller routes
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
// Navigation routes
  { method: "GET", path: "/about", config: aboutController.index },
  { method: "GET", path: "/dashboard", config: dashboardController.index },

// User routes
  { method: "GET", path: "/userdetails", config: userController.index },
  { method: "POST", path: "/userdetails/detailsupdate", config: userController.updateDetails },
  { method: "POST", path: "/userdetails/passwordupdate", config: userController.updatePassword },

// Admin routes
  { method: "GET", path: "/admin-view", config: adminController.adminIndex },
  { method: "GET", path: "/admin-view/delete-user/{id}", config: adminController.deleteUser},

// Poi routes
  { method: "POST", path: "/dashboard/addPoi", config: poiController.addPoi },
  { method: "GET", path: "/dashboard/deletePoi/{id}", config: poiController.deletePoi },
  { method: "GET", path: "/poi/edit/{id}", config: poiController.index },
  { method: "POST", path: "/poi/update/{id}", config: poiController.update },
  { method: "GET", path: "/public-poi/view/{id}", config: poiController.publicIndex },
  {method: "POST", path: "/public-poi/view/{id}/add-comment", config: poiController.addComment },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
