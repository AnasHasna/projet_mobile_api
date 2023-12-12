import express from "express";
import { handleRating } from "../controllers/ratingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const ratingRouter = express.Router();

ratingRouter.route("/").post(verifyToken, handleRating);

export default ratingRouter;
