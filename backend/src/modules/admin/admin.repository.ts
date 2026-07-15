import { User } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IAdminRepository } from "./admin.interface.js";
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
}
