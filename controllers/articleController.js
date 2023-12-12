import expressAsyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import path from "path";
import fs from "fs";
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from "../utils/cloudinary.js";

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
    .populate({ path: "categoryId", select: "name" });
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
  res.status(201).json({ status: "success" });
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
      const deletedCloudImage = cloudinaryRemoveImage(article.image.public_id);
      if (deletedCloudImage) {
        const image = path.join(__dirname, `../images/${req.file.filename}`);
        const data = await cloudinaryUploadImage(image);
        article.image = {
          public_id: data.public_id,
          url: data.url,
        };
        fs.unlinkSync(image);
      } else {
        throw new Error("Internal Server Error(cloudinary)");
      }
    }
    await article.save();
    res.status(200).json({ status: "success" });
  } else {
    res.status(404);
    throw new Error("Article not found");
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
      const deletedCloudImage = cloudinaryRemoveImage(article.image.public_id);
      if (!deletedCloudImage) {
        throw new Error("Internal Server Error(cloudinary)");
      }
    }
    await article.remove();
    res.status(200).json({ status: "success" });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

export { addNewArticle, getArticles, updateArticle, deleteArticle };
