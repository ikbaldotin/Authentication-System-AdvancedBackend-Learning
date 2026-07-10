import { Request, Response } from "express";
import { CatchAsync } from "../../utils/helpers/CatchAsync.js";
import authService from "./auth.container.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";
import { setCookie } from "../../utils/auth/auth.helper.js";

export const registerUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"]! || "known";
    const ipAddress = req.ip || "known";
    const result = await authService.registerUserService({
      email,
      password,
      userAgent,
      ipAddress,
    });
    setCookie(res, result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "User register successfully",
      data: { user: result.user, accessToken: result.accessToken },
    });
  },
);

export const loginUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip || "unknown";
    const result = await authService.loginUser({
      email,
      password,
      userAgent,
      ipAddress,
    });
    setCookie(res, result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "user login successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);
