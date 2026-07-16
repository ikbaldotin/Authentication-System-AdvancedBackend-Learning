import { Role, User } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/errors/AppError.js";

import { IAdminRepository } from "./admin.interface.js";
import { updateRoleInputDTO } from "./admin.schema.js";
import { allRoleType, GetRoleByIdType } from "./admin.type.js";

export class AdminRepository implements IAdminRepository {
  async getAllUsers(): Promise<User[]> {
    const user = await prisma.user.findMany({
      include: {
        userRole: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return user;
  }
  async getAllRoles(): Promise<allRoleType> {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        userRoles: {
          select: {
            userId: true,
          },
        },
        rolePermissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return roles;
  }
  async getRoleById(roleId: string): Promise<GetRoleByIdType | null> {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        rolePermissions: {
          select: {
            assignedAt: true,
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        userRoles: {
          select: {
            assignedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
    return role;
  }
  async createRoleWithPermissions(
    name: string,
    permissions: string[],
  ): Promise<Role> {
    return prisma.$transaction(async (tx) => {
      const exitingRole = await tx.role.findUnique({
        where: { name },
      });
      if (exitingRole) {
        throw new AppError("ROLE_ALREADY_EXISTS", 404);
      }
      const dbPermissions = await tx.permission.findMany({
        where: {
          name: {
            in: permissions,
          },
        },
      });
      if (dbPermissions.length !== permissions.length) {
        throw new AppError("INVALID_PERMISSIONS", 403);
      }
      const role = await tx.role.create({
        data: {
          name,
        },
      });
      await tx.rolePermission.createMany({
        data: dbPermissions.map((permission) => ({
          roleId: role.id,
          permissionId: permission.id,
        })),
      });
      return role;
    });
  }
  async updateRole(roleId: string, data: updateRoleInputDTO): Promise<Role> {
    return await prisma.$transaction(async (tx) => {
      const exitingRole = await tx.role.findUnique({
        where: {
          id: roleId,
        },
        include: {
          rolePermissions: true,
        },
      });
      if (!exitingRole) {
        throw new AppError("ROLE_NOT_FOUND", 404);
      }
      if (data.name) {
        const duplicateRole = await tx.role.findFirst({
          where: {
            name: data.name,
            NOT: {
              id: roleId,
            },
          },
        });
        if (duplicateRole) {
          throw new AppError("ROLE_ALREADY_EXISTS", 409);
        }
      }
      const updateRole = await tx.role.update({
        where: {
          id: roleId,
        },
        data: {
          ...(data.name && {
            name: data.name,
          }),
        },
      });
      if (data.permissions) {
        const dbPermissions = await tx.permission.findMany({
          where: {
            name: {
              in: data.permissions,
            },
          },
        });
        if (dbPermissions.length !== data.permissions.length) {
          throw new AppError("INVALID_PERMISSIONS", 400);
        }
        // delete role permissions
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
          },
        });
        // insert new permissions
        await tx.rolePermission.createMany({
          data: dbPermissions.map((permission) => ({
            roleId,
            permissionId: permission.id,
          })),
        });
      }
      return updateRole;
    });
  }
}
