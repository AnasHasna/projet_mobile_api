import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    image: {
      type: Object,
      default: {
        url: "https://www.udacity.com/blog/wp-content/uploads/2021/02/img8.png",
        publicId: null,
      },
    },
  },
  { timestamps: true }
);

// categoryModel
const Category = mongoose.model("Category", categorySchema);

export { Category };
