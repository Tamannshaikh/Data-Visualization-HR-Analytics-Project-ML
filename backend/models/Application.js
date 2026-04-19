const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  resumeUrl: { type: String, required: true }, // Cloudinary URL
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if applied via account
  status: { 
    type: String, 
    enum: ["Applied", "Shortlisted", "Waiting", "Rejected", "Selected", "Second Round"], 
    default: "Applied" 
  },
  aiScore: { type: Number, default: 0 },
  aiMatchedSkills: [{ type: String }],
  aiMissingSkills: [{ type: String }],
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);
