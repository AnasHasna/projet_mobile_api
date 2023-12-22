import expressAsyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import Category from "../models/categoryModel.js";
import Favoris from "../models/favorisModel.js";

/**
 * @desc    HomeController to get all necessary data
 * @route   GET /api/home
 * @access  public
 */

const homeController = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (userId === undefined) {
    res.status(400).json({ status: "fail", message: "bad request" });
  } else {
    const categories = await Category.find();
    const news = await Article.find()
      .sort({ createdAt: -1 })
      .populate("categoryId");

    const favoris = await Favoris.find({ user: userId })
      .populate("article")
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      data: {
        categories,
        news,
        favoris,
      },
    });
  }
});

export { homeController };
