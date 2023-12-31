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
import Article from "../models/articleModel.js";

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
  const categories = await Category.find(queryOptions).sort({ createdAt: -1 });
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
      .json({ status: "failed", message: "Catégorie déjà existante." });
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
 * @description     Get single category
 * @router          /categories/:id
 * @method          GET
 * @access          public
 */

const getSingleCategoryController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "Catégorie non trouvée.",
    });
  } else {
    //get the number of articles in this category
    const numberOfArticles = await Article.countDocuments({
      categoryId: id,
    });

    res.status(200).json({
      status: "success",
      data: {
        category,
        numberOfArticles,
      },
    });
  }
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
      message: "Catégorie non trouvée.",
    });
  }
  category.name = name || category.name;
  category.description = description || category.description;

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
      message: "Catégorie non trouvée.",
    });
  }
  await cloudinaryRemoveImage(category.image.publicId);
  await category.deleteOne();
  res.status(200).json({
    status: "success",
    message: "Catégorie supprimée avec succès.",
  });
});

export {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getSingleCategoryController,
  updateCategoryController,
};
