import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};



// =========================
// ✅ REGISTER
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,   // ✅ MUST BE HERE
  subscriptionActive: user.subscriptionActive,
  adUnlocks: user.adUnlocks,
  token: generateToken(user._id),
});

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};



// =========================
// ✅ LOGIN
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionActive: user.subscriptionActive,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};



// =========================
// ✅ ACTIVATE SUBSCRIPTION
// =========================
export const activateSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.subscriptionActive = true;
    await user.save();

    res.json({ message: "Subscription activated" });

  } catch (error) {
    console.error("SUBSCRIPTION ERROR:", error);
    res.status(500).json({ message: "Failed to activate subscription" });
  }
};

// =========================
// ✅ UNLOCK BOOK (24 Hours)
// =========================
export const unlockBookWithAd = async (req, res) => {
  try {
    const { bookId } = req.body;

    const user = await User.findById(req.user._id);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    user.adUnlocks.push({
      book: bookId,
      expiresAt,
    });

    await user.save();

    res.json({
      message: "Book unlocked for 24 hours",
      expiresAt,
    });

  } catch (error) {
    console.error("UNLOCK ERROR:", error);
    res.status(500).json({ message: "Failed to unlock book" });
  }
};