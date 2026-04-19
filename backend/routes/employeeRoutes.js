const express = require("express");
const Employee = require("../models/Employee");
const User = require("../models/User");
const { generateOfferLetter } = require("../services/pdfGenerator");
const { sendStatusEmail } = require("../services/emailService");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Get Risk Analysis Data (Static Dataset)
router.get("/risk-data", async (req, res) => {
  try {
    const dataPath = path.join(process.cwd(), "hr_dashboard_data.json");
    if (fs.existsSync(dataPath)) {
      const jsonData = fs.readFileSync(dataPath, "utf-8");
      const rawData = JSON.parse(jsonData);
      
      const mappedData = rawData.map((emp, idx) => ({
        _id: `demo_${idx}`,
        name: emp.Name || `Employee ${idx + 1}`,
        email: emp.Email || `emp${idx + 1}@corphr.com`,
        role: emp.JobRole || emp.Role || "Specialist",
        department: emp.Department || "General",
        joiningDate: emp.JoiningDate || new Date(Date.now() - (emp.YearsAtCompany || 1) * 365 * 24 * 60 * 60 * 1000).toISOString(),
        ...emp
      }));
      
      return res.json(mappedData);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all employees (Live MongoDB HR Data)
router.get("/", async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
       const employees = await Employee.find().sort({ createdAt: -1 });
       return res.json(employees);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new employee
router.post("/", async (req, res) => {
  try {
    const { name, role, department, email, joiningDate } = req.body;
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot add employee in Demo Mode." });
    }
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ message: "Employee with this email already exists" });

    employee = new Employee({ name, role, department, email, joiningDate });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update an employee
router.put("/:id", async (req, res) => {
  try {
    const { name, role, department, email, joiningDate } = req.body;
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot update employee in Demo Mode." });
    }
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, role, department, email, joiningDate },
      { new: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Onboard new employee (Generate offer, create user, send email)
router.post("/onboard", async (req, res) => {
  try {
    const { name, username, email, role, department, salary, password } = req.body;
    
    if (!req.app.locals.dbConnected) {
       return res.status(503).json({ message: "Database not connected. Cannot onboard employee in Demo Mode." });
    }

    // Check if employee or user already exists
    let employee = await Employee.findOne({ email });
    if (employee) return res.status(400).json({ message: "Employee with this email already exists" });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User with this email already exists" });

    // 1. Create Employee Record
    const joiningDate = new Date(); // Or let them select it, we default to now for onboarding fast
    employee = new Employee({ name, username, role, department, email, joiningDate });
    await employee.save();

    // 2. Create User Account
    user = new User({
      name,
      username,
      email,
      password: password || "Welcome@123",
      role: "Employee"
    });
    await user.save();

    // 3. Generate PDF Offer Letter
    const attachmentData = await generateOfferLetter(name, role, salary || "Industry Standard");

    // 4. Send Email
    // Using sendStatusEmail with a special status "Onboarding"
    await sendStatusEmail(email, name, role, "Onboarding", attachmentData, { username, password: password || "Welcome@123" });

    res.status(201).json({ message: "Employee onboarded successfully", employee });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot delete employee in Demo Mode." });
    }
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Also remove associated user account so they can be re-onboarded
    await User.findOneAndDelete({ email: employee.email });

    await employee.deleteOne();
    res.json({ message: "Employee removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
