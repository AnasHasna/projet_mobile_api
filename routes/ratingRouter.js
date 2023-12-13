import express from "express";
import { handleRatingController } from "../controllers/ratingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const ratingRouter = express.Router();

ratingRouter.route("/").post(verifyToken, handleRatingController);

export default ratingRouter;
