import express from "express";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { authorizePermissions } from "../../middleware/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  createRoleController,
  getAllRolesController,
  getAllUserController,
  getRoleByIdController,
  updateRoleController,
} from "./admin.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createRoleSchema,
  getRoleByIdSchema,
  updateRoleSchema,
} from "./admin.schema.js";
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
router
  .route("/roles")
  .post(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(createRoleSchema),
    createRoleController,
  );
router
  .route("/roles/:roleId")
  .patch(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(updateRoleSchema),
    updateRoleController,
  );
export default router;
