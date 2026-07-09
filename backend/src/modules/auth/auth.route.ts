import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { registerUserController } from "./auth.controller.js";
import { registerUserSchema } from "./auth.schema.js";

const router = express.Router();
router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);

export default router;
