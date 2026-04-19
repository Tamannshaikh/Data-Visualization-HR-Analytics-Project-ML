const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load models
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in .env");
      process.exit(1);
    }

    console.log("🚀 Connecting to new database cluster...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected successfully!");

    // 1. Clear existing data (Careful!)
    console.log("🧹 Cleaning up old records...");
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // 2. Create Admin HR User
    console.log("👤 Creating Admin HR account...");
    const admin = new User({
      name: "Admin Shaik",
      email: "admin@corphr.com",
      password: "Admin@1234",
      role: "HR"
    });
    await admin.save();
    console.log("✅ Admin created: admin@corphr.com / Admin@1234");

    // 3. Create Sample Jobs
    console.log("💼 Seeding initial job openings...");
    const jobs = await Job.insertMany([
      {
        title: "Senior HR Manager",
        role: "Management",
        experienceRequired: "5+ Years",
        jobType: "Onsite",
        numberOfOpenings: 2,
        salaryRange: "80,000 - 1,20,000",
        jobDescription: "Looking for an experienced HR leader to manage organizational culture and recruitment strategy.",
        lastDateToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: "Recruitment Specialist",
        role: "Recruitment",
        experienceRequired: "2-3 Years",
        jobType: "Hybrid",
        numberOfOpenings: 5,
        salaryRange: "40,000 - 60,000",
        jobDescription: "Join our talent acquisition team to find the best engineers in the country.",
        lastDateToApply: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]);
    console.log(`✅ Seeded ${jobs.length} jobs.`);

    console.log("\n🎉 Database initialization complete!");
    console.log("You can now log in to the HR Portal at http://localhost:3000/login");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
