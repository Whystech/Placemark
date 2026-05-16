import { TextFile } from "lowdb/node";
import { discussionMongoStore } from "../models/mongo/discussion-mongo-store.js";

export const discussionController = {
  index: {
    handler: async function (request, h) {
      const discussions = await discussionMongoStore.getAllDiscussions();
      const viewData = {
        discussions: discussions,
      };
      return h.view("discussion-view", viewData);
    },
  },

  addDiscussion: {
    handler: async function (request, h) {
      const title = request.payload.title;
      const description = request.payload.description;
      const type = request.payload.type;
      const loggedInUser = request.auth.credentials;
      const userid = loggedInUser._id;
      const authorFirstname = loggedInUser.firstName;
      const authorLastname = loggedInUser.lastName;
      const isEdited = false;
      let comments = [];

      const newDiscussion = {
        title: title,
        description: description,
        type: type,
        author: authorFirstname + " " + authorLastname,
        userid: userid,
        isEdited: isEdited,
        comments: comments,
      };

      await discussionMongoStore.addDiscussion(newDiscussion);

      const discussions = await discussionMongoStore.getAllDiscussions();
      const viewData = {
        discussions: discussions,
      };

      return h.view("discussion-view", viewData);
    },
  },

  addDiscussionView: {
    handler: async function (request, h) {
      const viewData = {};
      return h.view("add-discussion", viewData);
    },
  },
};
