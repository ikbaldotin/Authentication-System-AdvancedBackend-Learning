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

export const revokeRoleFromUserController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const roleId = req.params.roleId as string;
    await adminService.removeRoleFromUser(userId, roleId);
    sendResponse(res, 200, {
      success: true,
      message: "Role removed successfuly",
    });
  },
);

export const getAllUserOfRolesController = CatchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;
    const result = await adminService.getAllUserRolesById(roleId);
    sendResponse(res, 200, {
      success: true,
      message: "all user fetched successfully",
      data: result,
    });
  },
);

export const getUserPermissionsController = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const result = await adminService.GetUserPermission(userId);
    sendResponse(res, 200, {
      success: true,
      message: "User permission fetched successfully",
      data: result,
    });
  },
);

export const getAllPermissionsController = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllPermissions();
    sendResponse(res, 200, {
      success: true,
      message: "Permissions fetched successfully",
      data: result,
    });
  },
);

export const getPermissionDetailController = CatchAsync(
  async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId as string;
    const result = await adminService.getPermissionDetail(permissionId);
    sendResponse(res, 200, {
      success: true,
      message: "Permission details fetched successfully",
      data: result,
    });
  },
);

export const getUsersByPermissionController = CatchAsync(
  async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId as string;
    const result = await adminService.getUsersByPermissions(permissionId);
    sendResponse(res, 200, {
      success: true,
      message: "User with the permissions fetched",
      data: result,
    });
  },
);
