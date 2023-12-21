import mongoose from "mongoose";

const favorisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  },
  {
    timestamps: true,
  }
);

const Favoris = mongoose.model("Favoris", favorisSchema);
export default Favoris;
