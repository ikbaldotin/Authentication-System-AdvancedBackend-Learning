import { IMMUTABLE_ROLES } from "../../constants/system-roles.js";
import { AppError } from "../../utils/errors/AppError.js";
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
    return updateRole;
  }
  async deleteRole(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    ensureIsRoleDeleteable(role);
    // if (IMMUTABLE_ROLES.includes(role.name as any)) {
    //   throw new AppError("system role can not be deleted", 403);
    // }
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
    // const immutableRoles = roles?.filter((role) =>
    //   IMMUTABLE_ROLES.includes(role.name as any),
    // );
    // if (!immutableRoles) {
    //   throw new AppError("roles not found", 404);
    // }
    // if (immutableRoles.length > 0) {
    //   throw new AppError("immutable role can not be assigned", 403);
    // }
    await this.adminRepo.assignRoleToUser(userId, data.roleIds);
  }
  async revokeRoleFromUser(userId: string, roleId: string) {
    await this.adminRepo.removerUserRole(userId, roleId);
  }
  async getAllUserRolesById(roleId: string) {
    const users = await this.adminRepo.getAllUserRolesById(roleId);
    return users;
  }
  async GetUserPermission(userId: string) {
    const users = await this.adminRepo.getUserPermissionByUserId(userId);
    const permissions = users.userRole.flatMap((userRoles) =>
      userRoles.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );
    const unqiuePermission = [...new Set(permissions)];
    return unqiuePermission;
  }
}
