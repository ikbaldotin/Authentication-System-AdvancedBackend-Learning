import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  loginUserController,
  registerUserController,
} from "./auth.controller.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";

const router = express.Router();
router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
export default router;
