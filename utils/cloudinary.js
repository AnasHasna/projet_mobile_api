import { api, config, uploader } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Upload Image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error(cloudinary)"); // give the error to errorHandler
  }
};

// Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicID) => {
  try {
    const result = await uploader.destroy(imagePublicID);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error(cloudinary)"); // give the error to errorHandler
  }
};

// Cloudinary Remove Multiple images
const cloudinaryRemoveMultipleImages = async (publicIds) => {
  try {
    const result = await api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error(cloudinary)"); // give the error to errorHandler
  }
};

export {
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImages,
  cloudinaryUploadImage,
};
