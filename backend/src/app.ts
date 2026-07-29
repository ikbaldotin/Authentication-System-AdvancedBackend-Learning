import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./utils/errors/AppError.js";
import authRouter from "./modules/auth/auth.route.js";
import oauthRouter from "./modules/auth/oauth/oauth.route.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import adminRouter from "./modules/admin/admin.route.js";
import { globalRateLimiter } from "./middleware/rate-limit/rate-limit.middleware.js";
export const app = express();
// app.set("trust proxy", 1);

app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalRateLimiter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/oauth", oauthRouter);
app.use((req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
