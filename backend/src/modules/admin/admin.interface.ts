import { Role, User } from "../../../generated/prisma/index.js";
import { updateRoleInputDTO } from "./admin.schema.js";
import { allRoleType, GetRoleByIdType } from "./admin.type.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;
  getAllRoles(): Promise<allRoleType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
  createRoleWithPermissions(name: string, permissions: string[]): Promise<Role>;
  updateRole(roleId: string, data: updateRoleInputDTO): Promise<Role>;
}
