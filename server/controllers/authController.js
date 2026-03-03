import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// REGISTER WITH OTP
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
  email,
  "InkNova OTP Verification",
  `Your OTP is: ${otp}`
);

console.log("OTP sent:", otp);

    res.status(201).json({
      message: "OTP sent to email",
      email,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};