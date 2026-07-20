import { Role, User } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/errors/AppError.js";

import { IAdminRepository } from "./admin.interface.js";
import { updateRoleInputDTO } from "./admin.schema.js";
import {
  allRoleType,
  getAllPermissionsType,
  GetAllUserByRoleId,
  getPermissionDetailType,
  GetRoleByIdType,
  GetUserByPermissionsType,
  GetUserPermission,
} from "./admin.type.js";

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
      where: {
        isDeleted: false,
      },
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
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        isSystem: true,
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
  async getRolesById(roleIds: string[]): Promise<Role[] | null> {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
        isDeleted: false,
      },
    });
    return roles;
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
  async deleteRole(roleId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const exitingRole = await tx.role.findUnique({
        where: {
          id: roleId,
          isDeleted: false,
        },
        include: {
          userRoles: true,
        },
      });
      if (!exitingRole) {
        throw new AppError("ROLE_NOT_FOUND", 404);
      }

      if (exitingRole.userRoles.length > 0) {
        throw new AppError("ROLE_ASSIGNED_TO_USER", 409);
      }
      await tx.role.update({
        where: {
          id: roleId,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
      return true;
    });
  }
  async assignRoleToUser(userId: string, roleIds: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const exitingUser = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!exitingUser) {
        throw new AppError("user not found", 404);
      }

      const roles = await tx.role.findMany({
        where: {
          id: {
            in: roleIds,
          },
          isDeleted: false,
        },
      });
      if (roles.length !== roleIds.length) {
        throw new AppError("INVALID_ROLES", 400);
      }

      const exitingAssignment = await tx.userRole.findMany({
        where: {
          userId,
          roleId: {
            in: roleIds,
          },
        },
      });
      const exitingRoleIds = new Set(
        exitingAssignment.map((assignment) => assignment.roleId),
      );
      const newAssignment = roleIds.filter(
        (roleId) => !exitingRoleIds.has(roleId),
      );
      if (newAssignment.length === 0) {
        throw new AppError("ROLES_ALREADY_ASSIGNED", 400);
      }
      await tx.userRole.createMany({
        data: newAssignment.map((roleId) => ({
          userId,
          roleId,
        })),
      });
      return true;
    });
  }
  async removerUserRole(userId: string, roleId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const assignment = await tx.userRole.findUnique({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
        include: {
          role: true,
        },
      });
      if (!assignment) {
        throw new AppError("ROLE_ASSIGNMENT_NOT_FOUND", 404);
      }
      if (assignment.role.name === "ADMIN") {
        const adminCount = await tx.userRole.count({
          where: {
            role: {
              name: "ADMIN",
            },
          },
        });
        if (adminCount <= 1) {
          throw new AppError("LAST_ADMIN_ROLE", 403);
        }
      }
      await tx.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });
      return true;
    });
  }
  async getAllUserRolesById(roleId: string): Promise<GetAllUserByRoleId[]> {
    const user = await prisma.userRole.findMany({
      where: {
        roleId,
      },
      include: {
        user: true,
      },
    });
    return user;
  }
  async getUserPermissionByUserId(userId: string): Promise<GetUserPermission> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  async getAllPermissions(): Promise<getAllPermissionsType[]> {
    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return permissions;
  }
  async getPermissionDetail(
    permissionId: string,
  ): Promise<getPermissionDetailType | null> {
    const permission = await prisma.permission.findUnique({
      where: {
        id: permissionId,
      },
      include: {
        rolePermissions: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return permission;
  }
  async getUsersByPermission(
    permissionId: string,
  ): Promise<GetUserByPermissionsType[]> {
    const user = await prisma.permission.findMany({
      where: {
        id: permissionId,
      },
      select: {
        id: true,
        name: true,
        rolePermissions: {
          select: {
            role: {
              select: {
                userRoles: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
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
}
