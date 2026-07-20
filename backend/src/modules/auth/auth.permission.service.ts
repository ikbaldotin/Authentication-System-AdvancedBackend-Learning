import { logger } from "../../config/logger.js";
import { prisma } from "../../lib/prisma.js";
import redis from "../../lib/redis.js";

export class PermissionService {
  private readonly CACHE_TIL = 60 * 60;
  private getCacheKey(userId: string) {
    return `permissions:${userId}`;
  }
  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = this.getCacheKey(userId);
    const cachePermissions = await redis.get(cacheKey);
    if (cachePermissions) {
      logger.info("CACHE HIT");
      return JSON.parse(cachePermissions);
    }
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
      return [];
    }
    const permission = user.userRole.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermissio) => rolePermissio.permission.name,
      ),
    );
    const uniquePermission = [...new Set(permission)];
    await redis.set(
      cacheKey,
      JSON.stringify(uniquePermission),
      "EX",
      this.CACHE_TIL,
    );
    return uniquePermission;
  }
  async invalidateUserPermissions(userId: string) {
    await redis.del(this.getCacheKey(userId));
  }
  async invalidateRoleUser(roleId: string) {
    const users = await prisma.userRole.findMany({
      where: {
        roleId,
      },
      select: {
        userId: true,
      },
    });
    if (!users.length) {
      return;
    }
    const key = users.map((user) => this.getCacheKey(user.userId));
    await redis.del(...key);
  }
}

export const permissionService = new PermissionService();
