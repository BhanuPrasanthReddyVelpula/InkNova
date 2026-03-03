import Book from "../models/Book.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config(); // MUST be before config

console.log("Cloudinary ENV TEST:");
console.log("Name:", process.env.CLOUD_NAME);
console.log("Key:", process.env.CLOUD_API_KEY);
console.log("Secret:", process.env.CLOUD_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* =========================
   DASHBOARD STATS
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const subscribers = await User.countDocuments({ subscriptionActive: true });
    const freeUsers = await User.countDocuments({ subscriptionActive: false });

    res.json({
      totalUsers,
      totalBooks,
      subscribers,
      freeUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL BOOKS
========================= */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE BOOK
========================= */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPLOAD BOOK
========================= */
export const adminUploadBook = async (req, res) => {
  try {
    console.log("=== UPLOAD START ===");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ message: "PDF required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",   // 🔥 VERY IMPORTANT
    });

    console.log("Cloudinary success:", result.secure_url);

    const book = await Book.create({
      title: req.body.title,
      description: req.body.description,
      pdfUrl: result.secure_url,
    });

    res.status(201).json(book);

  } catch (error) {
    console.error("=== UPLOAD ERROR ===");
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};