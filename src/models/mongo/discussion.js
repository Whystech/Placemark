import Mongoose from "mongoose";
import Boom from "@hapi/boom";

const { Schema } = Mongoose;

const discussionSchema = new Schema({
  title: String,
  description: String,
  type: String,
  author: String,
  date: String,
  userid:  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isEdited: Boolean,
  comments: [
    {
      commentBody:String,
      author: String,
      authorId: String,
      date: String
    }
  ]
});

export const Discussion = Mongoose.model("Discussion", discussionSchema);
