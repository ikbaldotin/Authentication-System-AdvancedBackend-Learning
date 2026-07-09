import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./utils/errors/AppError.js";
import authRouter from "./modules/auth/auth.route.js";
export const app = express();
// app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use((req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
