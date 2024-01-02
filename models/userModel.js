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

export { User };
