import express from "express";
import {
  addNewArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "../controllers/articleController.js";

const articleRouter = express.Router();

articleRouter.route("/").get(getArticles).post(addNewArticle);
articleRouter.route("/:id").put(updateArticle).delete(deleteArticle);

export default articleRouter;
