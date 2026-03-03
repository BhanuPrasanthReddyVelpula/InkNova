import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadBook,
  getBooks,
  streamBook,
  unlockBook,
  checkBookAccess
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", protect, uploadBook);
router.get("/", getBooks);
router.get("/stream/:id", protect, streamBook);  // ✅ IMPORTANT
router.post("/unlock/:id", protect, unlockBook);
router.get("/access/:id", protect, checkBookAccess);

export default router;