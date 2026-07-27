import type {
  authAccount,
  AuthProvider,
  User,
} from "../../../generated/prisma/index.js";
import type { Session } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import type { IAuthRepository } from "./auth.interface.js";
import type {
  AuthAccountWithUser,
  createSessionType,
  createUserType,
  findUserByIdType,
  linkAuthAccountType,
  updateSessionType,
  UserPermissionsType,
} from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async createUser(data: createUserType): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
    return user;
  }
  async createSession(data: createSessionType): Promise<Session> {
    const token = await prisma.session.create({
      data,
    });
    return token;
  }
  async findUserById(userId: string): Promise<findUserByIdType | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    return user;
  }

  async findSessionById(sessionId: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    return session;
  }
  async revokedUserAllSession(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
      },
      data: {
        isRevoked: true,
      },
    });
  }
  async updateSession(
    sessionId: string,
    data: updateSessionType,
  ): Promise<Session> {
    const session = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash: data.hashedRefreshToken,
        expiresAt: data.newRefreshTokenExpiryAt,
      },
    });
    return session;
  }
  async findSessionByUserAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null> {
    const session = await prisma.session.findFirst({
      where: {
        userId,
        id: sessionId,
      },
    });
    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        id: sessionId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
  async deleteUserAllSession(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
  async getUserPermissions(
    userId: string,
  ): Promise<UserPermissionsType | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        userRole: {
          select: {
            role: {
              select: {
                id: true,
                name: true,

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
            },
          },
        },
      },
    });

    return user;
  }
  async findAuthAccount(
    provider: AuthProvider,
    providerAccountId: string,
  ): Promise<AuthAccountWithUser | null> {
    const authAccount = await prisma.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });
    return authAccount;
  }
  async createAuthAccount(data: authAccount): Promise<authAccount> {
    return await prisma.authAccount.create({
      data,
    });
  }
  async linkAuthAccount(data: linkAuthAccountType): Promise<authAccount> {
    const authAccount = await prisma.authAccount.create({
      data: {
        userId: data.userId,
        providerAccountId: data.providerAccountId,
        provider: data.provider,
      },
    });
    return authAccount;
  }
}
