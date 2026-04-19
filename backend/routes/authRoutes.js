const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 🟠 DEMO MODE FALLBACK
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    const isDemoAdmin = (email === "admin@corphr.com" || email === "admin@example.com");
    const isDemoPassword = (password === "admin123" || password === "Admin@1234");

    if (isDemoMode && isDemoAdmin && isDemoPassword) {
      const payload = { user: { id: "demo_admin_id", role: "HR" } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, role: "HR", name: "Demo Admin" });
    }

    // Check both email and username
    if (!req.app.locals.dbConnected) {
      return res.status(401).json({ 
        message: "Invalid Credentials or Database Offline.",
        hint: "Demo Login: admin@corphr.com | Passwords: admin123 or Admin@1234"
      });
    }

    const user = await User.findOne({ 
      $or: [ { email: email }, { username: email } ] 
    });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    if (!req.app.locals.dbConnected) {
       return res.status(401).json({ message: "Invalid Credentials (Database Offline)" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
