import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import connectToDB from "./config/connectToDB.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRouter from "./routes/authRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import articleRouter from "./routes/articleRouter.js";

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
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/articles", articleRouter);

// error middlewares
app.use(notFound);
app.use(errorHandler);

// server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
