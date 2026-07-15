import express from "express";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { authorizePermissions } from "../../middleware/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  getAllRolesController,
  getAllUserController,
  getRoleByIdController,
} from "./admin.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { getRoleByIdSchema } from "./admin.schema.js";
const router = express.Router();
router
  .route("/all-users")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    getAllUserController,
  );
router
  .route("/all-roles")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    getAllRolesController,
  );
router
  .route("/role/:roleId")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getRoleByIdSchema, "params"),
    getRoleByIdController,
  );
export default router;
