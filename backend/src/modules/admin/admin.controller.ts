import { Request, Response } from "express";
import { CatchAsync } from "../../utils/helpers/CatchAsync.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";
import adminService from "./admin.contrains.js";
import { Result } from "pg";

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

export const createRoleController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.createRole(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "create role successfully",
      data: result,
    });
  },
);

export const updateRoleController = CatchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const result = await adminService.updateRole(roleId, req.body);
    console.log({ result });
    sendResponse(res, 200, {
      success: true,
      message: "role updated successfully",
      data: result,
    });
  },
);
export const deleteRoleController = CatchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    await adminService.deleteRole(roleId);
    sendResponse(res, 200, {
      success: true,
      message: "role deleted successfully",
    });
  },
);

export const assignedRoleToUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    await adminService.assignRoleToUser(userId, req.body);
    sendResponse(res, 200, {
      success: true,
      message: "Role assigned role to user successfully",
    });
  },
);
