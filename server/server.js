import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { configureCloudinary } from "./config/cloudinary.js";

configureCloudinary();


// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);

// ✅ DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// ✅ START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);