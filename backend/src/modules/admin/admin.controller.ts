import { Request, Response } from "express";
import { CatchAsync } from "../../utils/helpers/CatchAsync.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";
import adminService from "./admin.contrains.js";

export const getAllUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUser();
    sendResponse(res, 200, {
      success: true,
      message: "user fetched successfully",
      data: result,
    });
  },
);
