import { User } from "../../../generated/prisma/index.js";
import { Session } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { createSessionType, createUserType } from "./auth.types.js";

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
}
