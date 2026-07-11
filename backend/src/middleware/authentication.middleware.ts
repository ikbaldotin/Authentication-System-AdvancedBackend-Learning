import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors/AppError.js";
import { verifyAccessToken } from "../utils/auth/jwt.js";
import { JWTPayload } from "../modules/auth/auth.types.js";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      return next(new AppError("Authentication required", 401));
    }
    if (!authHeaders.startsWith("Bearer")) {
      return next(new AppError("Invalid authenticatin header formate", 401));
    }
    const accessToken = authHeaders.split(" ")[1];

    if (!accessToken) {
      return next(new AppError("access token is missing", 401));
    }
    const payload = verifyAccessToken(accessToken) as JWTPayload;

    if (!payload) {
      return next(new AppError("Invalid access token", 401));
    }
    req.user = {
      userId: payload.sub,
      sessionId: payload.sessionId,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      new AppError("Access Token expires", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      new AppError("Invalid access token", 401);
    }
    return next(error);
  }
};
