import express from "express";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getSingleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import photoUpload from "../middleware/photoUpload.js";
import {
  verifyToken,
  verifyTokenAndBeAdmin,
} from "../middleware/verifyToken.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(verifyToken, getCategoriesController)
  .post(
    verifyTokenAndBeAdmin,
    photoUpload.single("image"),
    addCategoryController
  );

categoryRouter
  .route("/:id")
  .put(
    verifyTokenAndBeAdmin,
    photoUpload.single("image"),
    updateCategoryController
  )
  .get(verifyToken, getSingleCategoryController)
  .delete(verifyTokenAndBeAdmin, deleteCategoryController);

export default categoryRouter;
