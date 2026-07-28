import { AuthRepository } from "../auth.repository.js";
import { GooogleAuthService } from "./oauth.service.js";
import { AuthService } from "../auth.service.js";
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const googleAuthService = new GooogleAuthService(authRepository, authService);
export default googleAuthService;
