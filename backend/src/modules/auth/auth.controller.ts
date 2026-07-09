import { Request, Response } from "express";
import { CatchAsync } from "../../utils/helpers/CatchAsync.js";
import authService from "./auth.container.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";

export const registerUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.registerUserService({
      email,
      password,
    });
    sendResponse(res, 201, {
      success: true,
      message: "User register successfully",
      data: result,
    });
  },
);
