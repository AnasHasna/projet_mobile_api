import express from "express";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import {
  verifyToken,
  verifyTokenAndBeAdmin,
} from "../middleware/verifyToken.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(verifyToken, getCategoriesController)
  .post(verifyTokenAndBeAdmin, addCategoryController);

categoryRouter
  .route("/:id")
  .get(verifyTokenAndBeAdmin, updateCategoryController)
  .delete(verifyTokenAndBeAdmin, deleteCategoryController);

export default categoryRouter;
