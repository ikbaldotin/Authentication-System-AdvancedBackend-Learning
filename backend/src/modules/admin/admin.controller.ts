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

export const getAllRolesController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllRoles();
    sendResponse(res, 200, {
      success: true,
      message: "user role fetched successfully",
      data: result,
    });
  },
);

export const getRoleByIdController = CatchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const result = await adminService.getRoleById(roleId);
    sendResponse(res, 200, {
      success: true,
      message: "role id fetched successfuly",
      data: result,
    });
  },
);
