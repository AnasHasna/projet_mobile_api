import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import {
  User,
  validateForgetPassword,
  validateLoginUser,
  validateSendVerificationCode,
  validateSignUpUser,
  validateVerifyCode,
} from "../models/userModel.js";

/**
 * @description     register new user
 * @router          /auth/signup
 * @method          POST
 * @access          public
 */

const signup = asyncHandler(async (req, res) => {
  // validate req.body
  const { error } = validateSignUpUser(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  // check if user already exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ status: false, message: "email already exist" });
  }
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // generate verify code Math.floor(Math.random() * (max - min + 1)) + min;
  const genVerifyCode = Math.floor(Math.random() * 90000) + 10000;

  // create user and save it
  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    verifyCode: genVerifyCode,
  });
  await user.save();
  user = await User.findById(user._id)
    .select("-password")
    .select("-verifyCode");
  // send response

  res
    .status(201)
    .json({ status: true, message: "user create with success", user: user });
});

/**
 * @description     login user
 * @router          /api/auth/login
 * @method          POST
 * @access          public
 */

const login = asyncHandler(async (req, res) => {
  // validate req.body
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  // is user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ status: false, message: "user not found" });
  }
  // check the password
  const isPasswordMath = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMath) {
    return res
      .status(400)
      .json({ status: false, message: "password not correct" });
  }
  const token = user.generateAuthToken();
  // response to user
  const { password, verifyCode, ...rest } = user._doc;
  res.status(200).json({
    status: true,
    message: "login successefuly",
    user: {
      ...rest,
      token: token,
    },
  });
});

/**
 * @description     forget password
 * @router          /api/auth/forgetpassword
 * @method          POST
 * @access          public
 */
const forgetpassword = asyncHandler(async (req, res) => {
  // validation req.body
  const { error } = validateForgetPassword(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  // check if the user is exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ status: false, message: "email not exist" });
  }
  // generate verify code Math.floor(Math.random() * (max - min + 1)) + min;
  const genVerifyCode = Math.floor(Math.random() * 90000) + 10000;
  // update verification code for the user
  user = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        verifyCode: genVerifyCode,
      },
    },
    { new: true }
  );
  // TODO: send verification code to user email/phone
  // send responde to user
  const { password, verifyCode, ...rest } = user._doc;
  res.status(200).json({ status: true, user: rest });
});

/**
 * @description     verifyCode
 * @router          /api/auth/verifycode
 * @method          POST
 * @access          public
 */

const verifyCode = asyncHandler(async (req, res) => {
  // check req.body
  const { error } = validateVerifyCode(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  // compare verify codes
  const user = await User.findOne({ email: req.body.email });
  if (parseInt(req.body.verifyCode) !== user.verifyCode) {
    return res
      .status(400)
      .json({ status: false, message: "verify code not correct" });
  }

  // if the account is not verified===>verify it
  if (!user.isAccountVerified) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isAccountVerified: true,
      },
    });
  }

  // if everythings is correct
  res.status(200).json({ status: true });
});

/**
 * @description     Send Verification Code
 * @router          /api/auth/sendverificationcode
 * @method          POST
 * @access          public
 */

const sendverificationcode = asyncHandler(async (req, res) => {
  // check req.body
  const { error } = validateSendVerificationCode(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  // check if the email is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ status: false, message: "email not exist" });
  }

  // generate new verification code
  const genVerifyCode = Math.floor(Math.random() * 90000) + 10000;

  // update verification code for the user on DB
  await User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { verifyCode: genVerifyCode } },
    { new: true }
  );

  //TODO: send verification code to user email

  // if everythings is correct
  res.status(200).json({ status: true });
});

export { forgetpassword, login, sendverificationcode, signup, verifyCode };
