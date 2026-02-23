import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function resetUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} user(s)`);

    await mongoose.disconnect();
    console.log("✅ Reset complete! You can now register a fresh account.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

resetUsers();
