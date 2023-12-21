import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Article from "../models/articleModel.js";
import Rating from "../models/ratingModel.js";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "../utils/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @desc    Fetch articles
 * @route   GET /api/articles/?_id
 * @access  Private
 */

const getArticles = expressAsyncHandler(async (req, res) => {
  const queryOptions = {};
  for (const key in req.query) {
    if (Object.hasOwnProperty.call(req.query, key)) {
      queryOptions[key] = req.query[key];
    }
  }
  const articles = await Article.find({ ...queryOptions })
    .sort({ createdAt: -1 })
    .populate("categoryId");
  res.status(200).json({ status: "success", data: articles });
});

/**
 * @desc    Add new article
 * @route   POST /api/articles
 * @access  Private
 */
const addNewArticle = expressAsyncHandler(async (req, res) => {
  const { title, author, content, categoryId } = req.body;
  let article = new Article({
    title,
    author,
    content,
    categoryId,
    image: null,
  });
  if (req.file) {
    const image = path.join(__dirname, `../images/${req.file.filename}`);
    const data = await cloudinaryUploadImage(image);
    article.image = {
      public_id: data.public_id,
      url: data.url,
    };
    fs.unlinkSync(image);
  }
  await article.save();
  res.status(201).json({ status: "success", data: article });
});

/**
 * Update article
 * @route   PUT /api/articles/:id
 * @access  Private
 */
const updateArticle = expressAsyncHandler(async (req, res) => {
  const { title, author, content, categoryId } = req.body;
  const article = await Article.findById(req.params.id);
  if (article) {
    article.title = title || article.title;
    article.author = author || article.author;
    article.content = content || article.content;
    article.categoryId = categoryId || article.categoryId;
    if (req.file) {
      const deletedCloudImage = await cloudinaryRemoveImage(
        article.image.public_id
      );
      if (deletedCloudImage) {
        const image = path.join(__dirname, `../images/${req.file.filename}`);
        const data = await cloudinaryUploadImage(image);
        article.image = {
          public_id: data.public_id,
          url: data.url,
        };
        fs.unlinkSync(image);
      }
    }
    await article.save();
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ status: "fail", message: "Article not found" });
  }
});

/**
 * Delete article
 * @route   DELETE /api/articles/:id
 * @access  Private
 */
const deleteArticle = expressAsyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article) {
    if (article.image) {
      const deletedCloudImage = await cloudinaryRemoveImage(
        article.image.public_id
      );
      if (!deletedCloudImage) {
        res.status(500).json({
          status: "fail",
          message: "Internal Server Error(cloudinary)",
        });
      }
    }
    await article.remove();
    res.status(200).json({ status: "success" });
  } else {
    res.status(404).json({ status: "fail", message: "Article not found" });
  }
});

/**
 * Get single article
 * @route   GET /api/articles/:id
 * @access  Private
 */
const getSingleArticle = expressAsyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate({
    path: "categoryId",
    select: "name",
  });
  if (!article) {
    res.status(404).json({ status: "fail", message: "Article not found" });
  } else {
    const { userId } = req.body;
    const rating = await Rating.findOne({
      user: userId,
      article: req.params.id,
    });
    const articleRating = await Rating.find({ article: req.params.id }).select(
      "rating"
    );
    const totalRating = articleRating.reduce(
      (acc, item) => acc + item.rating,
      0
    );
    const avgRating = totalRating / articleRating.length;
    res
      .status(200)
      .json({ status: "success", data: { article, rating, avgRating } });
  }
});

export {
  addNewArticle,
  deleteArticle,
  getArticles,
  getSingleArticle,
  updateArticle,
};
