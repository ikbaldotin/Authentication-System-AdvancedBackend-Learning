import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  loginUserController,
  registerUserController,
  getUserController,
  refreshTokenController,
  logoutController,
  logoutUserFromAllSession,
  getUserPermissionsController,
} from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { loginRateLimiter } from "../../middleware/rate-limit/login-rate-limit.js";
import { registerRateLimit } from "../../middleware/rate-limit/register-rate-limit.js";
import { refreshRateLimit } from "../../middleware/rate-limit/refresh-token-rate-limit.js";

const router = express.Router();
router
  .route("/register")
  .post(
    registerRateLimit,
    validate(registerUserSchema),
    registerUserController,
  );
router
  .route("/login")
  .post(loginRateLimiter, validate(loginUserSchema), loginUserController);
router.route("/me").get(authMiddleware, getUserController);
router.route("/refresh-token").post(refreshRateLimit, refreshTokenController);
router
  .route("/me/permissions")
  .get(authMiddleware, getUserPermissionsController);
router.route("/logout").post(authMiddleware, logoutController);

router
  .route("/logout-all-device")
  .post(authMiddleware, logoutUserFromAllSession);
export default router;
