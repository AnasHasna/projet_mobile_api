import expressAsyncHandler from "express-async-handler";
import Favoris from "../models/favorisModel.js";

/**
 * @desc    get all favoris
 * @route   POST /api/favoris/getfavoris
 * @access  Private
 */

const getAllFavorisController = expressAsyncHandler(async (req, res) => {
  const favoris = await Favoris.find({ user: req.body.userId }).populate(
    "article"
  );
  res.status(200).json({ status: "success", data: favoris });
});

/**
 * @desc    Add new favoris
 * @route   POST /api/favoris
 * @access  Private
 */

const addToFavorisController = expressAsyncHandler(async (req, res) => {
  const { articleId, userId } = req.body;
  if (articleId === undefined || userId === undefined) {
    res.status(400).json({ status: "fail", message: "bad request" });
  }
  console.log(articleId, userId);
  const favoris = await Favoris.findOne({
    article: articleId,
    user: userId,
  });
  if (favoris !== null) {
    res.status(200).json({ status: "success", data: favoris });
  } else {
    const favoris = new Favoris({
      article: articleId,
      user: userId,
    });
    await favoris.save();
    res.status(201).json({ status: "success", data: favoris });
  }
});

/**
 * @desc    Delete from favoris
 * @route   Delete /api/favoris
 * @access  Private
 */

const deleteFromFavorisController = expressAsyncHandler(async (req, res) => {
  const { favorisId } = req.body;

  await Favoris.findByIdAndDelete(favorisId);
  res.status(200).json({ status: "success", data: "Deleted with success" });
});

export {
  addToFavorisController,
  deleteFromFavorisController,
  getAllFavorisController,
};
