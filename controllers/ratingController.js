import expressAsyncHandler from "express-async-handler";
import Rating from "../models/ratingModel.js";

/**
 * @desc    Add new rating
 * @route   POST /api/ratings
 * @access  Private
 */

const handleRating = expressAsyncHandler(async (req, res) => {
  const { rating, userId, articleId } = req.body;
  const ratingExist = await Rating.findOne({
    user: userId,
    article: articleId,
  });
  if (ratingExist) {
    ratingExist.rating = rating;
    await ratingExist.save();
    res.status(201).json({ status: "success" });
  } else {
    const userRating = new Rating({
      rating,
      user: userId,
      article: articleId,
    });
    await userRating.save();
    res.status(201).json({ status: "success" });
  }
});

export { handleRating };
