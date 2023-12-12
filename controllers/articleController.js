import expressAsyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import path from "path";
import fs from "fs";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";

/**
 * @desc    Fetch all articles
 * @route   GET /api/articles
 * @access  Private
 */

const getAllArticles = expressAsyncHandler(async (req, res) => {
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
