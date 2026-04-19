import Mongoose from "mongoose";

const { Schema } = Mongoose;

const poiSchema = new Schema({
  name: String,
  category: String,
  description: String,
  summary: String,
  latitude: Number,
  longitude: Number,
  isPrivate: Boolean,
  comments: [
    {
      title: String,
      text: String,
      authorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      author: String,
      date: { type: Date, default: Date.now }
    }
  ],
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ratings: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref:"User"
      },
      value: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

export const Poi = Mongoose.model("Poi", poiSchema);
