import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authorizePermissions =
  (...requiredPermission: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError("Unauthorized", 401));
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
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
        return next(new AppError("user not found", 404));
      }

      // extract all permission
      const permissions = user.userRole.flatMap((userRole) =>
        userRole.role.rolePermissions.map(
          (rolePermission) => rolePermission.permission.name,
        ),
      );
      // remove duplicates
      const uniquePermission = [...new Set(permissions)];

      const hasPermission = requiredPermission.every((permission) =>
        uniquePermission.includes(permission),
      );

      if (!hasPermission) {
        return next(new AppError("Forbidden", 403));
      }
      next();
    } catch (error) {
      return next(error);
    }
  };
