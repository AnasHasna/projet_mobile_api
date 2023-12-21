import expressAsyncHandler from "express-async-handler";

/**
 * @desc    Home controller to get all necessary data
 * @route   GET /api/home
 * @access  public
 */

const homeController = expressAsyncHandler(async (req, res) => {
  res.status(200).json({ status: "success", data: "home" });
});

export { homeController };
