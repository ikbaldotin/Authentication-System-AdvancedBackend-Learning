import { AppError } from "../../utils/errors/AppError.js";
import { toResponseDTO } from "./admin.dto.js";
import { IAdminRepository } from "./admin.interface.js";
import { createRoleInputDTO, updateRoleInputDTO } from "./admin.schema.js";

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
    const updateRole = await this.adminRepo.updateRole(roleId, data);
    return updateRole;
  }
}
