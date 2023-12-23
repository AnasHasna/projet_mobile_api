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
  .post(verifyToken, addToFavorisController)
  .delete(verifyToken, deleteFromFavorisController);
favorisRouter.route("/getfavoris").post(verifyToken, getAllFavorisController);

export default favorisRouter;
