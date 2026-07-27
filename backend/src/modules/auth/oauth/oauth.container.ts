import { AuthRepository } from "../auth.repository.js";
import { GooogleAuthService } from "./oauth.service.js";

const authRepository = new AuthRepository();
const googleAuthService = new GooogleAuthService(authRepository);
export default googleAuthService;
