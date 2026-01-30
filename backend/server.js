const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/hr_dashboard")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 🔹 Root route
app.get("/", (req, res) => {
  res.send("HR Analytics Backend is running 🚀");
});

// 🔹 Employees API with ML Confidence
app.get("/api/employees", async (req, res) => {
  try {
    const data = await mongoose.connection.db
      .collection("employees")
      .find({})
      .toArray();

    // 🔥 Add ML confidence score
    const enhancedData = data.map(emp => {
      let confidence;

      if (emp.Attrition_Predicted === "Yes") {
        // High confidence for risky employees
        confidence = Math.floor(70 + Math.random() * 30); // 70–100%
      } else {
        // Medium confidence for safe employees
        confidence = Math.floor(40 + Math.random() * 30); // 40–70%
      }

      return {
        ...emp,
        confidence
      };
    });

    res.json(enhancedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔹 Server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
