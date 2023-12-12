import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    author: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    content: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
