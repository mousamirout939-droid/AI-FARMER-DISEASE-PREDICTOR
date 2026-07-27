import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

console.log("MONGO_URI:", process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not found in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const admin = await User.findOne({
      email: "admin@aifarmer.com",
    });

    if (admin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await User.create({
      name: "Administrator",
      email: "admin@aifarmer.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
      avatar: {
        url: "",
        publicId: "",
      },
      location: {},
      language: "en",
      farmDetails: {},
      expertDetails: {},
      refreshTokens: [],
      isGoogleAccount: false,
    });

    console.log("\n==================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("==================================");
    console.log("Email    : admin@aifarmer.com");
    console.log("Password : Admin@123");
    console.log("==================================");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();