import express from "express";
import { getUsers, updateUser } from "../controllers/userController.js";
import photoUpload from "../middleware/photoUpload.js";
import { verifyToken } from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/", verifyToken, getUsers);

userRouter.put("/:id", verifyToken, photoUpload.single("image"), updateUser);

export default userRouter;
