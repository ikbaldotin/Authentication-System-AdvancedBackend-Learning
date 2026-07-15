import { AppError } from "../../utils/errors/AppError.js";
import { toResponseDTO } from "./admin.dto.js";
import { IAdminRepository } from "./admin.interface.js";

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
}
