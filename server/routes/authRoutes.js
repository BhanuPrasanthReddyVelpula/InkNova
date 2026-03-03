import express from "express";
import {
  register,
  login,
  activateSubscriptionController,
  getMe   // 🔥 ADD THIS
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/subscribe", protect, activateSubscriptionController);
router.get("/me", protect, getMe);

export default router;