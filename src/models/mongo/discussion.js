import Mongoose from "mongoose";
import Boom from "@hapi/boom";

const { Schema } = Mongoose;

const discussionSchema = new Schema({
  title: String,
  description: String,
  type: String,
  author: String,
  userid:  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isEdited: Boolean,
  comments: [
    {
      commentbody:String,
      author: String,
      authorId: String
    }
  ]
});

export const Discussion = Mongoose.model("Discussion", discussionSchema);
