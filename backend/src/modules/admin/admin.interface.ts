import { User } from "../../../generated/prisma/index.js";
import { allRoleType, GetRoleByIdType } from "./admin.type.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;
  getAllRoles(): Promise<allRoleType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
}
