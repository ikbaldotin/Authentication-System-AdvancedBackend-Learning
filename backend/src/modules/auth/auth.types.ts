import { AuthProvider, Prisma } from "../../../generated/prisma/index.js";
export type createUserType = {
  email: string;
  password: string | null;
};

export type JWTPayload = {
  sub: string;
  sessionId: string;
};
export type UserType = {
  userId: string;
  sessionId: string;
};
export type findUserByIdType = {
  id: string;
  email: string;

  createdAt: Date;
};
export type createSessionType = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
};

export type updateSessionType = {
  hashedRefreshToken: string;
  newRefreshTokenExpiryAt: Date;
};

export type UserPermissionsType = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;

    userRole: {
      select: {
        role: {
          select: {
            id: true;
            name: true;

            rolePermissions: {
              select: {
                permission: {
                  select: {
                    id: true;
                    name: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type linkAuthAccountType = {
  userId: string;
  providerAccountId: string;
  provider: AuthProvider;
};
export type AuthAccountWithUser = Prisma.authAccountGetPayload<{
  where: {
    provider_providerAccountId: {
      provider: true;
      providerAccountId: true;
    };
  };
  include: {
    user: true;
  };
}>;

export interface TurnstileVerificationResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  error_code?: string[];
  action?: string;
  cdata?: string;
}
