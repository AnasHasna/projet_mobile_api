import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { Category } from "../models/categoryModel";

/**
 * @description     add new category
 * @router          /categories
 * @method          POST
 * @access          private (admin)
 */

const addCategoryController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  let category = await Category.findOne({ name: name });
  if (category) {
    return res
      .status(400)
      .json({ status: false, message: "category already exist" });
  }
  category = new Category({
    name,
    description,
  });

  const file = req.file;
  if (file) {
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    category.image = {
      url: result.url,
      publicId: result.public_id,
    };
    fs.unlinkSync(imagePath);
  }

  await category.save();

  res
    .status(201)
    .json({
      status: true,
      message: "category created with success",
      category: category,
    });
});

export { addCategoryController };
