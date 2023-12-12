import express from "express";
import {
  addNewArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "../controllers/articleController.js";
import {
  verifyToken,
  verifyTokenAndBeAdmin,
} from "../middleware/verifyToken.js";
import photoUpload from "../middleware/photoUpload.js";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(verifyToken, getArticles)
  .post(verifyTokenAndBeAdmin, photoUpload.single("image"), addNewArticle);
articleRouter
  .route("/:id")
  .put(verifyTokenAndBeAdmin, photoUpload.single("image"), updateArticle)
  .delete(verifyTokenAndBeAdmin, deleteArticle)
  .get(verifyToken, getSingleArticle);

export default articleRouter;
