import { hashPassword } from "../../utils/auth/password.js";
import { AppError } from "../../utils/errors/AppError.js";
import { IAuthRepository } from "./auth.interface.js";
import { sanitizeUserResponse } from "./auth.response.js";
import { createUserType } from "./auth.types.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}
  async registerUserService(data: createUserType) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("user already exit", 404);
    }
    const hashedPassword = await hashPassword(data.password);
    const createUser = await this.authRepo.createUser({
      email: data.email,
      password: hashedPassword,
    });
    return sanitizeUserResponse(createUser);
  }
}
