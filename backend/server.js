require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/employees", employeeRoutes);

// 🔹 Initialize Database Status
app.locals.dbConnected = false;

// 🔹 Database Status API (for Frontend)
app.get("/api/status", (req, res) => {
  res.json({ dbConnected: !!app.locals.dbConnected });
});

// 🔹 MongoDB connection (Cloud-compatible for Serverless)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.log("⚠️ MONGODB_URI is not defined. Using Standalone Demo Mode (Local JSON).");
    app.locals.dbConnected = false;
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    app.locals.dbConnected = isConnected;
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.log("❌ MongoDB connection error:", err.message);
    app.locals.dbConnected = false;
    mongoose.set('bufferCommands', false);
  }
}

// Ensure DB is connected before any API routes
app.use("/api", async (req, res, next) => {
  await connectDB();
  next();
});

// 🔹 Resolve paths relative to the process working directory (reliable on Vercel)
const rootPath = process.cwd();
const buildPath = path.join(rootPath, "frontend", "build");
const dataPath = path.join(rootPath, "hr_dashboard_data.json");

// 🔹 Serve Static Frontend Files
app.use(express.static(buildPath));

// 🔹 Legacy Employees API with ML Confidence (for Analytics)
app.get("/api/analytics/employees", async (req, res) => {
  try {
    let data;

    if (req.app.locals.dbConnected) {
      data = await mongoose.connection.db
        .collection("employees")
        .find({})
        .toArray();
    } else {
      // 🔽 FALLBACK: Read from local JSON (Demo Mode)
      if (fs.existsSync(dataPath)) {
        const jsonData = fs.readFileSync(dataPath, "utf-8");
        data = JSON.parse(jsonData);
      } else {
        throw new Error(`Data file not found at ${dataPath}`);
      }
    }

    // 🔥 Add ML confidence and map fields for Demo Mode
    const enhancedData = data.map((emp, idx) => {
      const confidence = emp.Attrition_Predicted === "Yes"
        ? Math.floor(70 + Math.random() * 30)
        : Math.floor(40 + Math.random() * 30);

      return { 
        ...emp, 
        _id: emp._id || `demo_${idx}`,
        name: emp.Name || emp.name || `Employee ${idx + 1}`,
        email: emp.Email || emp.email || `emp${idx + 1}@corphr.com`,
        role: emp.JobRole || emp.role || "Specialist",
        department: emp.Department || emp.department || "General",
        joiningDate: emp.JoiningDate || emp.joiningDate || new Date(Date.now() - (emp.YearsAtCompany || 1) * 365 * 24 * 60 * 60 * 1000).toISOString(),
        confidence 
      };
    });

    res.json(enhancedData);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 🔹 Catch-all route for React (Excluding /api and /uploads)
app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  const indexPath = path.join(buildPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Cloud Dashboard is active, but frontend build was not found.");
  }
});

// 🔹 Server start (local development)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Working Dir: ${rootPath}`);
  });
}

module.exports = app;
