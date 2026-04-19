const express = require("express");
const Job = require("../models/Job");
const { authorize } = require("../middleware/auth");
const router = express.Router();
const { mockJobs } = require("../utils/mockData");

// Get all jobs (HR only)
router.get("/all", authorize("HR"), async (req, res) => {
  try {
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    if (isDemoMode) {
      return res.json(mockJobs);
    }
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all active jobs (Public)
router.get("/", async (req, res) => {
  try {
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    if (isDemoMode) {
      return res.json(mockJobs.filter(j => j.isActive));
    }
    const jobs = await Job.find({ isActive: true, lastDateToApply: { $gte: new Date() } });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get job details (Public)
router.get("/:id", async (req, res) => {
  try {
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    if (isDemoMode) {
      const job = mockJobs.find(j => 
        (j._id && j._id.toString() === req.params.id) || 
        (j.id && j.id.toString() === req.params.id)
      );
      if (!job) return res.status(404).json({ message: "Job not found (Demo Mode)" });
      return res.json(job);
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create Job (HR only)
router.post("/", authorize("HR"), async (req, res) => {
  try {
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot create job in Demo Mode." });
    }
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Job (HR only)
router.put("/:id", authorize("HR"), async (req, res) => {
  try {
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot update job in Demo Mode." });
    }
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete Job (HR only)
router.delete("/:id", authorize("HR"), async (req, res) => {
  try {
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot delete job in Demo Mode." });
    }
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
