import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import Category from "../models/categoryModel.js";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "../utils/cloudinary.js";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description     Get all categories
 * @router          /categories
 * @method          GET
 * @access          public
 */

const getCategoriesController = asyncHandler(async (req, res) => {
  const queryOptions = {};
  for (const key in req.query) {
    if (Object.hasOwnProperty.call(req.query, key)) {
      queryOptions[key] = req.query[key];
    }
  }
  const categories = await Category.find(queryOptions);
  res.status(200).json({
    status: "success",
    data: categories,
  });
});

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

  res.status(201).json({
    status: "success",
    data: category,
  });
});

/**
 * @description     update category
 * @router          /categories/:id
 * @method          PUT
 * @access          private (admin)
 */

const updateCategoryController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "category not found",
    });
  }
  category.name = name;
  category.description = description;

  const file = req.file;
  if (file) {
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    await cloudinaryRemoveImage(category.image.publicId);
    category.image = {
      url: result.url,
      publicId: result.public_id,
    };
    fs.unlinkSync(imagePath);
  }

  await category.save();

  res.status(200).json({
    status: "success",
    data: category,
  });
});

/**
 * @description     delete category
 * @router          /categories/:id
 * @method          DELETE
 * @access          private (admin)
 */

const deleteCategoryController = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "category not found",
    });
  }
  await cloudinaryRemoveImage(category.image.publicId);
  await category.remove();
  res.status(200).json({
    status: "success",
    message: "category deleted",
  });
});

export {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
};
