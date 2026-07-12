import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  loginUserController,
  registerUserController,
  getUserController,
  refreshTokenController,
  logoutController,
  logoutUserFromAllSession,
} from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";

const router = express.Router();
router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
router.route("/me").get(authMiddleware, getUserController);
router.route("/refresh-token").post(refreshTokenController);
router.route("/logout").post(authMiddleware, logoutController);
router
  .route("/logout-all-device")
  .post(authMiddleware, logoutUserFromAllSession);
export default router;
