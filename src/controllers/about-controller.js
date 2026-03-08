export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About placemark",
      };
      return h.view("about-view", viewData);
    },
  },
};
