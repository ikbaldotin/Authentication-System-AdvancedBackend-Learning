import { User } from "../../../generated/prisma/index.js";

export const sanitizeUserResponse = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    provider: user.provider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
