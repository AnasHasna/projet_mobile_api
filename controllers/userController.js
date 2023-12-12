import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { User } from "../models/userModel.js";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description     update user
 * @router          /api/users
 * @method          PUT
 */

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findById(id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (req.file) {
      const image = path.join(__dirname, `../images/${req.file.filename}`);
      const data = await cloudinaryUploadImage(image);
      user.image = {
        public_id: data.public_id,
        url: data.url,
      };
      fs.unlinkSync(image);
    }
    await user.save();
    res
      .status(200)
      .json({ status: true, message: "user updated with success" });
  } else {
    res.status(404).json({ status: false, message: "user not found" });
  }
});

export { updateUser };
