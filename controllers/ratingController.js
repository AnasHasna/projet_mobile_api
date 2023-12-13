import expressAsyncHandler from "express-async-handler";
import Rating from "../models/ratingModel.js";

/**
 * @desc    Add new rating
 * @route   POST /api/ratings
 * @access  Private
 */

const handleRatingController = expressAsyncHandler(async (req, res) => {
  const { articleId, userId, rating } = req.body;
  const rate = await Rating.findOne({
    article: articleId,
    user: userId,
  });
  if (rate !== null) {
    rate.rating = rating;
    await rate.save();
    return res.status(200).json({ status: "success", data: rate });
  } else {
    rate.rating = rating;
    res.status(201).json({ status: "success", data: rate });
  }
});

export { handleRatingController };
