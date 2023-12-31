import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

/**
 * @description     register new user
 * @router          /auth/signup
 * @method          POST
 * @access          public
 */

const signup = asyncHandler(async (req, res) => {
  // validate req.body
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Veuillez remplir tous les champs." });
  }

  // check if user already exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ status: false, message: "Email existe déjà." });
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

  res.status(201).json({
    status: true,
    message: "Utilisateur créé avec succès.",
    user: user,
  });
});

/**
 * @description     login user
 * @router          /api/auth/login
 * @method          POST
 * @access          public
 */

const login = asyncHandler(async (req, res) => {
  // validate req.body
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ status: false, message: "Veuillez remplir tous les champs." });
  }

  // is user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "Utilisateur non trouvé." });
  }
  // check the password
  const isPasswordMath = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMath) {
    return res
      .status(400)
      .json({ status: false, message: "Mot de passe incorrect." });
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
  if (!req.body.email)
    return res
      .status(400)
      .json({ status: false, message: "Email est obligatoire." });

  // check if the user is exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: false, message: "Utilisateur non trouvé." });
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
  if (!req.body.email)
    return res
      .status(400)
      .json({ status: false, message: "Email est obligatoire." });
  if (!req.body.verifyCode)
    return res.status(400).json({
      status: false,
      message: "Code de vérification est obligatoire.",
    });

  // compare verify codes
  const user = await User.findOne({ email: req.body.email });
  if (parseInt(req.body.verifyCode) !== user.verifyCode) {
    return res
      .status(400)
      .json({ status: false, message: "Code de vérification incorrect." });
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
  if (!req.body.email)
    return res
      .status(400)
      .json({ status: false, message: "Email est obligatoire." });

  // check if the email is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: false, message: "Utilisateur non trouvé." });
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

const changePasswordController = asyncHandler(async (req, res) => {
  if (!req.body.email)
    return res
      .status(400)
      .json({ status: false, message: "Email est obligatoire." });
  if (!req.body.password)
    return res
      .status(400)
      .json({ status: false, message: "Mot de passe est obligatoire." });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user === null) {
    return res
      .status(404)
      .json({ status: false, message: "Utilisateur non trouvé." });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ status: true });
});
export {
  changePasswordController,
  forgetpassword,
  login,
  sendverificationcode,
  signup,
  verifyCode,
};
