import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import photoUpload from "../middleware/photoUpload.js";
import { updateUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.put("/:id", verifyToken, photoUpload.single("image"), updateUser);

export default userRouter;
