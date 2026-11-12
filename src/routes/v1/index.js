import express from "express";
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
const router = express.Router();

router.use('/auth', authRoutes)
router.use('/users', userRoutes)

router.get("/", (req, res) => {
  res.json({ message: "Welcome to API v1" });
});

export default router;
