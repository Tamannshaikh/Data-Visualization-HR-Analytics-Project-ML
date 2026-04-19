const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  skillsRequired: [{ type: String }],
  salaryRange: { type: String },
  jobType: { type: String, enum: ["Remote", "Onsite", "Hybrid"] },
  workingDays: { type: String },
  benefits: [{ type: String }],
  locationPreference: { type: String, enum: ["Local", "Non-local", "Any"] },
  numberOfOpenings: { type: Number, default: 1 },
  lastDateToApply: { type: Date, required: true },
  jobDescription: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
