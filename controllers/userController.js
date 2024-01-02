import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { User } from "../models/userModel.js";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "../utils/cloudinary.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description     get all users
 * @router          /api/users
 * @method          GET
 */

const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({
    isAdmin: false,
  })
    .select("-password")
    .sort({ createdAt: -1 });
  res.status(200).json({
    status: true,
    message: "Utilisateurs récupérés avec succès.",
    users,
  });
});

/**
 * @description     update user
 * @router          /api/users
 * @method          PUT
 */

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findById(id);
  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (req.file) {
      const image = path.join(__dirname, `../images/${req.file.filename}`);
      const data = await cloudinaryUploadImage(image);
      console.log(data);
      console.log(user);
      if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.public_id);
      }
      user.profilePhoto = {
        publicId: data.public_id,
        url: data.url,
      };
      fs.unlinkSync(image);
    }
    await user.save();
    const updatedUser = await User.findById(id)
      .select("-password")
      .select("-verifyCode");
    res.status(200).json({
      status: true,
      message: "Utilisateur mis à jour avec succès.",
      user: updatedUser,
    });
  } else {
    res
      .status(404)
      .json({ status: false, message: "Utilisateur introuvable." });
  }
});

export { getUsers, updateUser };
