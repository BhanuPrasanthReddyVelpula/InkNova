import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  activateSubscription,
  unlockBookWithAd
} from "../controllers/userController.js";

const router = express.Router();

router.post("/activate", protect, activateSubscription);
router.post("/unlock", protect, unlockBookWithAd);

export default router;