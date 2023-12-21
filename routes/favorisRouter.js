import express from "express";
import {
  addToFavorisController,
  deleteFromFavorisController,
  getAllFavorisController,
} from "../controllers/favorisController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const favorisRouter = express.Router();

favorisRouter
  .route("/")
  .get(verifyToken, getAllFavorisController)
  .post(verifyToken, addToFavorisController)
  .delete(verifyToken, deleteFromFavorisController);

export default favorisRouter;
