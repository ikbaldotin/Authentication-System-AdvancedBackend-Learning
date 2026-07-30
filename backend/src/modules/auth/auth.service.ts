import ms, { StringValue } from "ms";
import {
  generateSessionId,
  hashRefreshToken,
} from "../../utils/auth/auth.helper.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth/jwt.js";
import { comparePassword, hashPassword } from "../../utils/auth/password.js";
import { AppError } from "../../utils/errors/AppError.js";
import { IAuthRepository } from "./auth.interface.js";
import { sanitizeUserResponse } from "./auth.response.js";
import { loginLockoutService } from "./security/login-logout.service.js";
import { env } from "../../config/env.config.js";
import { UserType } from "./auth.types.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}
  async createAuthenticatedSession(
    userId: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const sessionId = generateSessionId();
    const accessToken = signAccessToken({
      sub: userId,
      sessionId,
    });
    const refreshToken = signRefreshToken({
      sub: userId,
      sessionId,
    });
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const refreshTokenExpriesIn = ms(
      env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    );
    if (typeof refreshTokenExpriesIn !== "number") {
      throw new AppError("Invalid refresh token", 404);
    }
    const expiresAt = new Date(Date.now() + refreshTokenExpriesIn);
    await this.authRepo.createSession({
      id: sessionId,
      userId: userId,
      refreshTokenHash: hashedRefreshToken,
      userAgent: userAgent,
      ipAddress: ipAddress,
      expiresAt,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async registerUserService(data: {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
  }) {
    const { email, password, userAgent, ipAddress } = data;
    const existingUser = await this.authRepo.findUserByEmail(email);
    if (existingUser) {
      throw new AppError("user already exit", 404);
    }
    const hashedPassword = await hashPassword(data.password);
    const createUser = await this.authRepo.createUser({
      email: email,
      password: hashedPassword,
    });
    const authSession = await this.createAuthenticatedSession(
      createUser.id,
      data.userAgent,
      data.ipAddress,
    );
    return {
      user: sanitizeUserResponse(createUser),
      ...authSession,
    };
  }
  async loginUser(data: {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
  }) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);
    if (!existingUser || !existingUser.password) {
      await loginLockoutService.recordFailure(data.email, data.ipAddress);
      throw new AppError("Invalid credentials", 401);
    }
    const isPasswordCorrect = await comparePassword(
      data.password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      const lockResponse = await loginLockoutService.recordFailure(
        data.email,
        data.ipAddress,
      );

      throw new AppError("Invalid credentials", 401);
    }
    await loginLockoutService.clearFailures(data.email, data.ipAddress);
    const authSession = await this.createAuthenticatedSession(
      existingUser.id,
      data.userAgent,
      data.ipAddress,
    );
    return {
      user: sanitizeUserResponse(existingUser),
      ...authSession,
    };
  }
  async getLoggedInUser(data: UserType) {
    const user = await this.authRepo.findUserById(data.userId);

    if (!user) {
      throw new AppError("user not found", 404);
    }
    return user;
  }
  async refreshSession(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const session = await this.authRepo.findSessionById(payload.sessionId);
    console.log("session----", session);
    if (!session) {
      throw new AppError("session not found", 401);
    }
    if (session.isRevoked) {
      throw new AppError("session has revoked", 401);
    }
    if (session.expiresAt < new Date()) {
      throw new AppError("Session has expires", 401);
    }
    const incomingRefreshTokenHash = hashRefreshToken(refreshToken);
    const incomingRefreshTokenValid =
      incomingRefreshTokenHash === session.refreshTokenHash;
    if (!incomingRefreshTokenValid) {
      await this.authRepo.revokedUserAllSession(session.userId);
      throw new AppError("refresh token reuse detected", 401);
    }
    const newAccessToken = signAccessToken({
      sub: session.userId,
      sessionId: session.id,
    });
    const newRefreshToken = signRefreshToken({
      sub: session.userId,
      sessionId: session.id,
    });
    const hashedRefreshToken = hashRefreshToken(newAccessToken);
    const newRefreshTokenExpiryIn = ms(
      env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    );
    if (typeof newRefreshTokenExpiryIn !== "number") {
      throw new Error("Invalid refresh token expires");
    }
    const newRefreshTokenExpiryAt = new Date(
      Date.now() + newRefreshTokenExpiryIn,
    );
    const updateSession = await this.authRepo.updateSession(session.id, {
      hashedRefreshToken,
      newRefreshTokenExpiryAt,
    });
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  async logout(userId: string, sessionId: string) {
    const session = await this.authRepo.findSessionByUserAndSessionId(
      userId,
      sessionId,
    );
    if (!session) {
      throw new AppError(
        "session is not found and you are not authorized",
        401,
      );
    }
    await this.authRepo.deleteSession(session.id);
  }
  async logoutUserFromAllSession(userId: string) {
    await this.authRepo.deleteUserAllSession(userId);
  }
  async getUserPermissions(userId: string) {
    const user = await this.authRepo.getUserPermissions(userId);
    if (!user) {
      throw new AppError("user not found", 404);
    }
    // get role
    const role = user.userRole.map((userRoles) => userRoles.role.name);
    // get the permission
    const permission = user.userRole.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );
    // get unique permission
    const uniquePermission = [...new Set(permission)];
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      role,
      permission: uniquePermission,
    };
  }
}
