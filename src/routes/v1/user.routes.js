import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  updateUserRole,
} from "../../controllers/user.controller.js";
import {
  authenticate,
  requirePermission,
  requireOwnerOrPermission,
} from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../../config/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateUserRoleSchema } from "../../validations/user.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission(PERMISSIONS.USER_READ_ALL), getUsers);
router.get(
  "/:id",
  requireOwnerOrPermission(PERMISSIONS.USER_READ_ALL),
  getUserById,
);
router.post("/", requireOwnerOrPermission(PERMISSIONS.USER_MANAGE), createUser);
router.put(
  "/:id",
  requireOwnerOrPermission(PERMISSIONS.USER_MANAGE),
  updateUser,
);
router.delete(
  "/:id",
  requireOwnerOrPermission(PERMISSIONS.USER_MANAGE),
  deleteUser,
);
router.patch(
  "/:id",
  requireOwnerOrPermission(PERMISSIONS.USER_RESTORE),
  restoreUser,
);
router.patch(
  "/:id/role",
  authenticate,
  requireOwnerOrPermission(PERMISSIONS.USER_MANAGE_ROLES),
  validate(updateUserRoleSchema),
  updateUserRole,
);

export default router;
