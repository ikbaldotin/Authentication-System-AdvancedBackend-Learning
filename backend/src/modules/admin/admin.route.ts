import express from "express";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { authorizePermissions } from "../../middleware/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  assignedRoleToUserController,
  createRoleController,
  deleteRoleController,
  getAllRolesController,
  getAllUserController,
  getRoleByIdController,
  revokeRoleFromUserController,
  updateRoleController,
  getAllUserOfRolesController,
  getUserPermissionsController,
} from "./admin.controller.js";
import {
  validate,
  validateParams,
} from "../../middleware/validate.middleware.js";
import {
  createRoleSchema,
  getRoleByIdSchema,
  updateRoleSchema,
  deleteRoleSchema,
  assignRoleSchema,
  assignedRoleParamsSchema,
  revokeUserRoleParamsSchema,
  getAllUserOfRoleSchema,
  getUserPermissionSchema,
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
router
  .route("/roles/:roleId")
  .delete(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(deleteRoleSchema, "params"),
    deleteRoleController,
  );
router
  .route("/user/:userId/role")
  .post(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(assignedRoleParamsSchema, "params"),
    validateParams(assignRoleSchema, "body"),
    assignedRoleToUserController,
  );
router.route("/users/:userId/roles/:roleId").delete(
  authMiddleware,
  authorizePermissions(Permissions.MANAGE_ROLES),
  validate(revokeUserRoleParamsSchema, "params"),

  revokeRoleFromUserController,
);
router
  .route("/user/roles/:roleId")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getAllUserOfRoleSchema, "params"),
    getAllUserOfRolesController,
  );
router
  .route("/users/:userId/permissions")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    validate(getUserPermissionSchema, "params"),
    getUserPermissionsController,
  );
export default router;
