import { AppError } from "../../utils/errors/AppError.js";
import { permissionService } from "../auth/auth.permission.service.js";
import { toResponseDTO } from "./admin.dto.js";
import {
  ensureIsRoleAssignable,
  ensureIsRoleDeleteable,
  ensureIsRoleEditable,
} from "./admin.helper.js";
import { IAdminRepository } from "./admin.interface.js";
import {
  assignRoleInputDTO,
  createRoleInputDTO,
  updateRoleInputDTO,
} from "./admin.schema.js";

export class AdminService {
  constructor(private adminRepo: IAdminRepository) {}
  async getAllUser() {
    const user = await this.adminRepo.getAllUsers();
    return user;
  }
  async getAllRoles() {
    const roles = await this.adminRepo.getAllRoles();
    const data = roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      userCount: role.userRoles.length,
      permission: role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    }));
    return data;
  }
  async getRoleById(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("role not found", 404);
    }
    const responseDTO = toResponseDTO(role);
    return responseDTO;
  }
  async createRole(data: createRoleInputDTO) {
    try {
      const role = await this.adminRepo.createRoleWithPermissions(
        data.name,
        data.permissions,
      );
      return role;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "ROLE_ALREADY_EXISTS") {
          throw new AppError("Role already exists", 409);
        }
        if (error.message === "INVALID_PERMISSIONS") {
          throw new AppError("INVALID PERMISSIONS", 400);
        }
      }
      throw error;
    }
  }
  async updateRole(roleId: string, data: updateRoleInputDTO) {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("role not found", 404);
    }

    ensureIsRoleEditable(role);
    const updateRole = await this.adminRepo.updateRole(roleId, data);
    await permissionService.invalidateRoleUser(roleId);
    return updateRole;
  }
  async deleteRole(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    ensureIsRoleDeleteable(role);
    await permissionService.invalidateRoleUser(roleId);
    await this.adminRepo.deleteRole(roleId);
  }
  async assignRoleToUser(userId: string, data: assignRoleInputDTO) {
    const roles = await this.adminRepo.getRolesById(data.roleIds);
    if (!roles) {
      throw new AppError("role not found", 404);
    }
    for (const role of roles) {
      ensureIsRoleAssignable(role);
    }

    await this.adminRepo.assignRoleToUser(userId, data.roleIds);
    await permissionService.invalidateUserPermissions(userId);
  }
  async removeRoleFromUser(userId: string, roleId: string) {
    await this.adminRepo.removerUserRole(userId, roleId);
    await permissionService.invalidateUserPermissions(userId);
  }
  async getAllUserRolesById(roleId: string) {
    const users = await this.adminRepo.getAllUserRolesById(roleId);
    return users;
  }
  async GetUserPermission(userId: string) {
    const users = await this.adminRepo.getUserPermissionByUserId(userId);
    const userPermission = await permissionService.getUserPermissions(userId);
    return userPermission;
  }
  async getAllPermissions() {
    const permissions = await this.adminRepo.getAllPermissions();
    return permissions;
  }
  async getPermissionDetail(permissionId: string) {
    const permission = await this.adminRepo.getPermissionDetail(permissionId);
    return permission;
  }
  async getUsersByPermissions(permissionId: string) {
    const permissions = await this.adminRepo.getUsersByPermission(permissionId);

    if (!permissions || permissions.length === 0) {
      throw new AppError("Permission not found", 404);
    }

    const users = permissions.flatMap((rolePermission) =>
      rolePermission.rolePermissions.flatMap((rolePermission) =>
        rolePermission.role.userRoles.map((userRole) => userRole.user),
      ),
    );
    if (users.length === 0) {
      throw new AppError("Users not found", 404);
    }

    const uniqueUsers = Array.from(
      new Map(users.map((user) => [user.id, user])).values(),
    );

    return {
      permission: {
        id: permissions[0].id,
        name: permissions[0].name,
      },
      users: uniqueUsers,
    };
  }
}
