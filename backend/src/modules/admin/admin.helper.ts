import { AppError } from "../../utils/errors/AppError.js";

export const ensureIsRoleEditable = (role: { isSystem: boolean }) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_MODIFIED", 403);
  }
};
export const ensureIsRoleDeleteable = (role: {
  id: string;
  name: string;
  isSystem: boolean;
  createdAt: Date;
}) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_DELETED", 403);
  }
};
export const ensureIsRoleAssignable = (role: { isSystem: boolean }) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_ASSIGNED", 403);
  }
};

export const ensureIsRoleRemoveable = (role: { isSystem: boolean }) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_REMOVEABLE", 403);
  }
};
