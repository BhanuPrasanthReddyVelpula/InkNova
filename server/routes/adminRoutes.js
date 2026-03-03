import express from "express";
import multer from "multer";

import {
  getDashboardStats,
  getAllUsers,
  getAllBooks,
  deleteUser,
  deleteBook,
  adminUploadBook,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Dashboard
router.get("/stats", protect, adminOnly, getDashboardStats);

// Users
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Books
router.get("/books", protect, adminOnly, getAllBooks);
router.delete("/books/:id", protect, adminOnly, deleteBook);

// Upload
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("pdf"),
  adminUploadBook
);

export default router;