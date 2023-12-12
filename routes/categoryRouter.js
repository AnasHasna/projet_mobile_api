import express from "express";
import {
  forgetpassword,
  login,
  sendverificationcode,
  signup,
  verifyCode,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/forgetpassword", forgetpassword);
authRouter.post("/verifycode", verifyCode);
authRouter.post("/sendverificationcode", sendverificationcode);

export default authRouter;
