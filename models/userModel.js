import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868__480.png",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET_KEY
  );
};

// userModel
const User = mongoose.model("User", userSchema);

// validate SignUpUser
const validateSignUpUser = (obj) => {
  const shema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required("Prénom est obligatoire"),
    lastName: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required("Nom est obligatoire"),
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email()
      .required("Email est obligatoire"),
    password: Joi.string()
      .trim()
      .min(8)
      .max(50)
      .required("Mot de passe est obligatoire"),
  });

  return shema.validate(obj);
};

// validate loginUser
const validateLoginUser = (obj) => {
  const shema = Joi.object({
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email()
      .required("Email est obligatoire"),
    password: Joi.string()
      .trim()
      .min(8)
      .max(50)
      .required("Mot de passe est obligatoire"),
  });
  return shema.validate(obj);
};

// validate Forget Password
const validateForgetPassword = (obj) => {
  const shema = Joi.object({
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email()
      .required("Email est obligatoire"),
  });
  return shema.validate(obj);
};

// validate VerifyCode
const validateVerifyCode = (obj) => {
  const shema = Joi.object({
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email("Email est obligatoire")
      .required(),
    verifyCode: Joi.number().min(10000).max(99999),
  });
  return shema.validate(obj);
};

// validate SendVerification Code
const validateSendVerificationCode = (obj) => {
  const shema = Joi.object({
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email("Email est obligatoire")
      .required(),
  });
  return shema.validate(obj);
};

// validate UpdateUser
const validateUpdateUser = (obj) => {
  const shema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required("Prénom est obligatoire"),
    lastName: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .required("Nom est obligatoire"),
    email: Joi.string()
      .trim()
      .min(5)
      .max(50)
      .email()
      .required("Email est obligatoire"),
    password: Joi.string()
      .trim()
      .min(8)
      .max(50)
      .required("Mot de passe est obligatoire"),

    phone: Joi.string().trim().required("Téléphone est obligatoire"),
  });
  return shema.validate(obj);
};

export {
  User,
  validateForgetPassword,
  validateLoginUser,
  validateSendVerificationCode,
  validateSignUpUser,
  validateUpdateUser,
  validateVerifyCode,
};
