import { TextFile } from "lowdb/node";
import { discussionMongoStore } from "../models/mongo/discussion-mongo-store.js";
import { userMongoStore } from "../models/mongo/user-mongo-store.js";

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
        date: new Date()
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

  discussionView: {
    handler: async function (request, h) {
      const id = request.params.id
      const discussion = await discussionMongoStore.getDiscussionById(id)
      const viewData = {
        title: discussion.title,
        author: discussion.author,
        description: discussion.description,
        isEdited: discussion.isEdited,
        type: discussion.type,
        comments: discussion.comments,
        date : discussion.date,
        _id: id
      };
      return h.view("individual-discussion-view", viewData);
    }
  },

  addComment: {
    handler: async function (request, h) {
      const discussionId = await request.params.id
      const author = request.auth.credentials
      const date = new Date()
      const comment = {
        commentBody: request.payload.body,
        authorId: author._id,
        author: author.firstName + " " + author.lastName,
        authorLastName: author.lastName,
        date: date
      }
      await discussionMongoStore.addDiscussionComment(discussionId, comment)
      return h.redirect("/discussion/" + discussionId)
    }
  }
};
