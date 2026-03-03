import Book from "../models/Book.js";
import User from "../models/User.js";
import https from "https";

// Upload Book
export const uploadBook = async (req, res) => {
  try {
    const { title, description, pdfUrl } = req.body;

    const book = await Book.create({
      title,
      description,
      pdfUrl,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

// Get All Books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

// Secure Stream
export const streamBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(req.user._id);

    const now = new Date();

    const hasAdAccess = user.adUnlocks?.some(
      (unlock) =>
        unlock.book.toString() === id &&
        new Date(unlock.expiresAt) > now
    );

    if (!user.subscriptionActive && !hasAdAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    https.get(book.pdfUrl, (pdfRes) => {
      pdfRes.pipe(res);
    });

  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).json({ message: "Streaming failed" });
  }
};

// Unlock Book (Ad-based)
export const unlockBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.adUnlocks.push({
      book: id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    await user.save();

    res.json({ message: "Book unlocked for 30 minutes" });

  } catch (error) {
    console.error("Unlock error:", error);
    res.status(500).json({ message: error.message });
  }
};