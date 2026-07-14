import express from "express";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { authorizePermissions } from "../../middleware/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import { getAllUserController } from "./admin.controller.js";
const router = express.Router();
router
  .route("/all-users")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    getAllUserController,
  );

export default router;
