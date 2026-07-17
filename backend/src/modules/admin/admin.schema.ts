import z from "zod";
import { PermissionValues } from "../../constants/permissions.js";

export const getRoleByIdSchema = z.object({
  roleId: z.uuid(),
});
export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(16)
    .regex(
      /^[A-Z_]+$/,
      "Role name must contain only uppercase letters and underscores",
    ),
  permissions: z.array(z.enum(PermissionValues)),
});
export const updateRoleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[A-Z_]+$/)
      .optional(),
    permissions: z.array(z.enum(PermissionValues)).min(1).optional(),
  })
  .refine((data) => data.name !== undefined || data.permissions !== undefined, {
    message: "at least one field must be provider",
  });
export const deleteRoleSchema = z.object({
  roleId: z.uuid(),
});
export const assignRoleSchema = z.object({
  roleIds: z.array(z.uuid()).min(1),
});

export const assignedRoleParamsSchema = z.object({
  userId: z.uuid(),
});

export type createRoleInputDTO = z.infer<typeof createRoleSchema>;
export type updateRoleInputDTO = z.infer<typeof updateRoleSchema>;
export type deleteRoleDTO = z.infer<typeof deleteRoleSchema>;
export type assignRoleInputDTO = z.infer<typeof assignRoleSchema>;
