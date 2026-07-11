import { User } from "../../../generated/prisma/index.js";
import { Session } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import {
  createSessionType,
  createUserType,
  findUserByIdType,
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
}
