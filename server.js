import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import connectToDB from "./config/connectToDB.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import articleRouter from "./routes/articleRouter.js";
import authRouter from "./routes/authRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import favorisRouter from "./routes/favorisRouter.js";
import homeRouter from "./routes/homeRouter.js";
import ratingRouter from "./routes/ratingRouter.js";
import userRouter from "./routes/userRouter.js";

// configs
dotenv.config();
connectToDB();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// routes
app.use("/api/home", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/articles", articleRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/favoris", favorisRouter);

// error middlewares
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
