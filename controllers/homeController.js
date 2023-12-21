import expressAsyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import Category from "../models/categoryModel.js";
import Favoris from "../models/favorisModel.js";

/**
 * @desc    Home controller to get all necessary data
 * @route   GET /api/home
 * @access  public
 */

const homeController = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find();
  const news = await Article.find()
    .sort({ createdAt: -1 })
    .populate("categoryId");
  const favoris = await Favoris.find({ user: req.body.userId }).populate(
    "article"
  );
  res.status(200).json({
    status: "success",
    data: {
      categories,
      news,
      favoris,
    },
  });
});

export { homeController };
