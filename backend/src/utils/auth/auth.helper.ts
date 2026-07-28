import crypto from "crypto";
import type { Response } from "express";
import { env } from "../../config/env.config.js";
import ms from "ms";
export const hashRefreshToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
export const generateSessionId = () => {
  return crypto.randomUUID();
};

export const setCookie = (
  res: Response,

  refreshToken: string,
) => {
  const refreshTokenMaxAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);
  if (typeof refreshTokenMaxAge !== "number") {
    throw new Error("Invalid refresh token configration");
  }
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
    // path: "/api/v1/refresh-token",
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie(`refreshToken`, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",

    // path: "/api/v1/refresh-token",
  });
};
