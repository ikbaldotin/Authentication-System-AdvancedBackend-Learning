import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  loginUserController,
  registerUserController,
  getUserController,
} from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";

const router = express.Router();
router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
router.route("/me").get(authMiddleware, getUserController);
export default router;
