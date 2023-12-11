import {
  login,
  signup,
  verifyCode,
  sendverificationcode,
  forgetpassword,
} from "../controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/forgetpassword", forgetpassword);
authRouter.post("/verifycode", verifyCode);
authRouter.post("/sendverificationcode", sendverificationcode);

export default authRouter;
