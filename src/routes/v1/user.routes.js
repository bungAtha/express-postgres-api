import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/user.controller.js";
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from "../../middlewares/rbac.middleware.js";

const router = Router()

router.use(authenticate)
router.use(authorize('admin'))

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router