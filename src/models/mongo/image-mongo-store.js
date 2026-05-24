import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
};
cloudinary.config(credentials);

export const imageStore = {

  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function(imagefile) {
    /// store image temporarily for upload
    writeFileSync("./public/temp.img", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/temp.img");
    return response.url;
  },

  /// removing an image also from cloud
  deleteImage: async function(imageUrl) {
  /// Remove query params if any
  const cleanUrl = imageUrl.split("?")[0];
  /// Extract the part after /upload/
  /// Based on standard Cloudinary URL https://res.cloudinary.com/<cloud>/image/upload/v1234567890/folder/filename.jpg
  const publicIdWithExt = cleanUrl.split("/upload/")[1];
  /// Remove extension (.jpg, .png, etc.) - because of course why would Cloudinary would do that from their side
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

  await cloudinary.v2.uploader.destroy(publicId);
}

};
