require("dotenv").config({ path: "c:/Users/Sajiya/Desktop/HR-Analytics-Project/backend/.env" });
const mongoose = require("mongoose");
const Job = require("c:/Users/Sajiya/Desktop/HR-Analytics-Project/backend/models/Job");
const Application = require("c:/Users/Sajiya/Desktop/HR-Analytics-Project/backend/models/Application");
const Employee = require("c:/Users/Sajiya/Desktop/HR-Analytics-Project/backend/models/Employee");

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const jobCount = await Job.countDocuments();
    const appCount = await Application.countDocuments();
    const empCount = await Employee.countDocuments();
    
    console.log("Database Stats:");
    console.log(`Jobs: ${jobCount}`);
    console.log(`Applications: ${appCount}`);
    console.log(`Employees: ${empCount}`);
    
    if (empCount > 0) {
        const latestEmp = await Employee.findOne().sort({ createdAt: -1 });
        console.log(`Latest Employee Added: ${latestEmp.name} (${latestEmp.role})`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

checkDB();
