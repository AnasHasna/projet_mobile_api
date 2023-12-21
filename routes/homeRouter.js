import express from "express";

import { homeController } from "../controllers/homeController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const homeRouter = express.Router();

homeRouter.route("/").get(verifyToken, homeController);

export default homeRouter;
