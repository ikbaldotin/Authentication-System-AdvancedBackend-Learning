import type {
  authAccount,
  AuthProvider,
  Session,
  User,
} from "../../../generated/prisma/index.js";
import type {
  AuthAccountWithUser,
  createSessionType,
  createUserType,
  findUserByIdType,
  linkAuthAccountType,
  updateSessionType,
  UserPermissionsType,
} from "./auth.types.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  findUserById(userId: string): Promise<findUserByIdType | null>;
  findSessionById(sessionId: string): Promise<Session | null>;
  findSessionByUserAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null>;

  createUser(data: createUserType): Promise<User>;
  revokedUserAllSession(userId: string): Promise<void>;
  createSession(data: createSessionType): Promise<Session>;
  updateSession(sessionId: string, data: updateSessionType): Promise<Session>;
  deleteSession(sessionId: string): Promise<void>;
  deleteUserAllSession(userId: string): Promise<void>;
  getUserPermissions(userId: string): Promise<UserPermissionsType | null>;
  findAuthAccount(
    provider: AuthProvider,
    providerAccountId: string,
  ): Promise<AuthAccountWithUser | null>;
  createAuthAccount(data: authAccount): Promise<authAccount>;
  linkAuthAccount(data: linkAuthAccountType): Promise<authAccount>;
}
