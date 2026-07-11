export type createUserType = {
  email: string;
  password: string;
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
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
};
