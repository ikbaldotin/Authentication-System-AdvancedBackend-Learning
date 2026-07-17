import { Role, User } from "../../../generated/prisma/index.js";
import { assignRoleInputDTO, updateRoleInputDTO } from "./admin.schema.js";
import { allRoleType, GetRoleByIdType } from "./admin.type.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;
  getAllRoles(): Promise<allRoleType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
  getRolesById(roleIds: string[]): Promise<Role[] | null>;
  createRoleWithPermissions(name: string, permissions: string[]): Promise<Role>;
  updateRole(roleId: string, data: updateRoleInputDTO): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;
  assignRoleToUser(userId: string, roleIds: string[]): Promise<void>;
}
