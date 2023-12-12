import express from "express";
import {
  addCategoryController,
  getCategoriesController,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategoriesController)
  .post(addCategoryController);

export default categoryRouter;
