require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Employee = require("./models/Employee");

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const jobCount = await Job.countDocuments();
    const appCount = await Application.countDocuments();
    const empCount = await Employee.countDocuments();
    
    console.log("--- Database Statistics ---");
    console.log(`- Total Jobs: ${jobCount}`);
    console.log(`- Total Applications: ${appCount}`);
    console.log(`- Total Employees: ${empCount}`);
    
    if (empCount > 0) {
        const latestEmp = await Employee.findOne().sort({ createdAt: -1 });
        console.log(`- Latest Employee Added: ${latestEmp.name} (${latestEmp.role} in ${latestEmp.department})`);
    } else {
        console.log("- No employees found in the collection.");
    }
    
    console.log("---------------------------");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Database Verification Error:", err.message);
    process.exit(1);
  }
};

checkDB();
