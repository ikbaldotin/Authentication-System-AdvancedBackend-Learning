import { User } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IAdminRepository } from "./admin.interface.js";

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
}
