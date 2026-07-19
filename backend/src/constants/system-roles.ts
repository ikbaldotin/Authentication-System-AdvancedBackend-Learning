export const SYSTEM_ROLE = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;
export const IMMUTABLE_ROLES = [
  SYSTEM_ROLE.ADMIN,
  SYSTEM_ROLE.SUPER_ADMIN,
] as const;
