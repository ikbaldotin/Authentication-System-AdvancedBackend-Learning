import crypto from "crypto";
import { Response } from "express";
import { env } from "../../../config/env.config";
const OAUTH_STATE_COOKIE_NAME = "oauth_state";
export const generatedAuthState = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const setOauthStateCookie = (res: Response, state: string) => {
  res.cookie(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });
};

export const clearOauthStateCookie = (res: Response) => {
  res.clearCookie(OAUTH_STATE_COOKIE_NAME);
};

export const OAUTH_STATE_COOKIE = OAUTH_STATE_COOKIE_NAME;
