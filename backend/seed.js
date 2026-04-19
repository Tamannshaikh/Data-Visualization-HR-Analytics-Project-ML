/**
 * Seed Script - Creates an HR Admin account
 * Run with: node seed.js
 * 
 * Make sure your .env file has MONGODB_URI set before running.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("\n❌ ERROR: MONGODB_URI not found in .env file.");
  console.log("➡️  Create a .env file in the backend folder with:");
  console.log('   MONGODB_URI=your_mongodb_atlas_connection_string\n');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if HR user already exists
    const existing = await User.findOne({ email: "admin@corphr.com" });
    if (existing) {
      console.log("⚠️  HR admin already exists: admin@corphr.com");
      console.log("   Use these credentials to login.\n");
      await mongoose.disconnect();
      return;
    }

    // Create HR Admin
    const hrAdmin = new User({
      name: "HR Admin",
      email: "admin@corphr.com",
      password: "Admin@1234",
      role: "HR"
    });
    await hrAdmin.save();

    // Create a sample candidate
    const candidate = new User({
      name: "Sample Candidate",
      email: "candidate@corphr.com",
      password: "Test@1234",
      role: "Candidate"
    });
    await candidate.save();

    console.log("\n🎉 Seed completed! Created the following accounts:\n");
    console.log("┌─────────────────────────────────────────────────┐");
    console.log("│              HR ADMIN LOGIN                     │");
    console.log("│  Email   :  admin@corphr.com                   │");
    console.log("│  Password:  Admin@1234                         │");
    console.log("│  Role    :  HR                                  │");
    console.log("├─────────────────────────────────────────────────┤");
    console.log("│           CANDIDATE LOGIN (for testing)         │");
    console.log("│  Email   :  candidate@corphr.com               │");
    console.log("│  Password:  Test@1234                          │");
    console.log("│  Role    :  Candidate                           │");
    console.log("└─────────────────────────────────────────────────┘\n");
    console.log("🌐 Go to http://localhost:3000/login and sign in!\n");

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
