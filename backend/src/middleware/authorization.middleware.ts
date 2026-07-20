import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { permissionService } from "../modules/auth/auth.permission.service.js";

export const authorizePermissions =
  (...requiredPermission: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError("Unauthorized", 401));
      }

      const permissions = await permissionService.getUserPermissions(
        req.user.userId,
      );
      const hasPermission = requiredPermission.every((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        return next(new AppError("Forbidden", 403));
      }
      next();
    } catch (error) {
      return next(error);
    }
  };
