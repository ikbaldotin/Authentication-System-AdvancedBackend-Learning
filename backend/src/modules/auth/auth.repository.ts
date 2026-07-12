import { User } from "../../../generated/prisma/index.js";
import { Session } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import {
  createSessionType,
  createUserType,
  findUserByIdType,
  updateSessionType,
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
}
