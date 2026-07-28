import type { Request, Response } from "express";
import { CatchAsync } from "../../../utils/helpers/CatchAsync.js";
import googleAuthService from "./oauth.container.js";
import { sendResponse } from "../../../utils/common/response/AppResponse.js";

import { AppError } from "../../../utils/errors/AppError.js";
import {
  clearOauthStateCookie,
  OAUTH_STATE_COOKIE,
  setOauthStateCookie,
} from "./oauth.helper.js";
import { setCookie } from "../../../utils/auth/auth.helper.js";
import { env } from "../../../config/env.config.js";
export const redirectToGoogleController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await googleAuthService.generateGoogleAuthUrl();

    setOauthStateCookie(res, result.state);
    sendResponse(res, 200, {
      success: true,
      message: "Google auth url generated successfully",
      data: {
        url: result.url,
      },
    });
  },
);
export const googleCallBackController = CatchAsync(
  async (req: Request, res: Response) => {
    const state = req.query.state as string | undefined;
    const code = req.query.code as string | undefined;
    if (!state) {
      throw new AppError("ouath state is missing", 400);
    }
    if (!code) {
      throw new AppError("authorization code is missing", 400);
    }
    const cookieState = req.cookies[OAUTH_STATE_COOKIE];
    googleAuthService.validateOAuth(cookieState, state);
    clearOauthStateCookie(res);
    const userAgent = req.headers["user-agent"] ?? "unknown";
    const ipAddress = req.ip ?? "unknown";
    const result = await googleAuthService.handleGoogleCallback(
      code,
      userAgent,
      ipAddress,
    );
    setCookie(res, result.refreshToken);
    res.redirect(`${env.FRONTEND_URL}/dashboard`);
    // sendResponse(res, 200, {
    //   success: true,
    //   message: "Google callback received successfully",
    //   data: result,
    // });
  },
);
