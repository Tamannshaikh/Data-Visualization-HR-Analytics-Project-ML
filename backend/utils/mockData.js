const mongoose = require("mongoose");

// Helper to generate fake Mongo IDs
const generateId = () => new mongoose.Types.ObjectId();

const mockJobs = [
  {
    _id: generateId(),
    title: "Senior HR Manager",
    role: "HR",
    experienceRequired: "5-8 years",
    skillsRequired: ["Management", "Leadership", "HR Strategy"],
    salaryRange: "80,000 - 1,20,000",
    jobType: "Remote",
    locationPreference: "Any",
    numberOfOpenings: 1,
    lastDateToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    jobDescription: "We are looking for a Senior HR Manager to lead our human resources department.",
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: generateId(),
    title: "Recruitment Specialist",
    role: "HR",
    experienceRequired: "2-4 years",
    skillsRequired: ["Sourcing", "Interviewing", "Talent Acquisition"],
    salaryRange: "50,000 - 70,000",
    jobType: "Onsite",
    locationPreference: "Local",
    numberOfOpenings: 3,
    lastDateToApply: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    jobDescription: "Join our team to find the best talent in the industry.",
    isActive: true,
    createdAt: new Date()
  }
];

const mockApplications = [
  {
    _id: generateId(),
    candidateName: "John Doe",
    candidateEmail: "john.doe@example.com",
    resumeUrl: "https://example.com/resume1.pdf",
    jobId: mockJobs[0]._id,
    status: "Shortlisted",
    aiScore: 85,
    aiMatchedSkills: ["Management", "Leadership"],
    aiMissingSkills: ["HR Strategy"],
    appliedAt: new Date()
  },
  {
    _id: generateId(),
    candidateName: "Jane Smith",
    candidateEmail: "jane.smith@example.com",
    resumeUrl: "https://example.com/resume2.pdf",
    jobId: mockJobs[0]._id,
    status: "Applied",
    aiScore: 72,
    aiMatchedSkills: ["Management"],
    aiMissingSkills: ["Leadership", "HR Strategy"],
    appliedAt: new Date()
  }
];

const mockAdmin = {
  _id: generateId(),
  name: "Admin User",
  email: "admin@example.com",
  role: "HR",
  username: "admin"
};

module.exports = { mockJobs, mockApplications, mockAdmin };
