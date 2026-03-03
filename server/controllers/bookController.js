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
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Instead of protect middleware,
    // manually verify token if present

    let user = null;

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        user = null;
      }
    }

    if (!user) {
      return res.status(401).json({ message: "No token" });
    }

    const now = new Date();

    const hasAdAccess = user.adUnlocks?.some(
      (unlock) =>
        unlock.book.toString() === id &&
        new Date(unlock.expiresAt) > now
    );

    if (!user.subscriptionActive && !hasAdAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔥 Redirect directly to Cloudinary
    return res.redirect(book.pdfUrl);

  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Unlock Book (Ad-based)
export const unlockBook = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const bookId = req.params.id;

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Remove old unlock if exists
    user.adUnlocks = user.adUnlocks.filter(
      (unlock) => unlock.book.toString() !== bookId
    );

    user.adUnlocks.push({
      book: bookId,
      expiresAt,
    });

    await user.save();

    res.json({
      message: "Book unlocked",
      adUnlocks: user.adUnlocks,
    });

  } catch (error) {
    console.error("Unlock error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkBookAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

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

    // 🔥 Return Cloudinary URL
    const inlineUrl = book.pdfUrl.replace("/upload/", "/upload/fl_attachment:false/");

res.json({ pdfUrl: inlineUrl });

  } catch (error) {
    console.error("Access error:", error);
    res.status(500).json({ message: error.message });
  }
};