const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { authorize } = require("../middleware/auth");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { parseResumeAndScore } = require("../services/aiParser");
const { sendStatusEmail } = require("../services/emailService");
const { generateOfferLetter } = require("../services/pdfGenerator");
const router = express.Router();
const { mockApplications, mockJobs } = require("../utils/mockData");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Apply for a job
router.post("/:jobId/apply", upload.single('resume'), async (req, res) => {
  try {
    const { candidateName, candidateEmail } = req.body;
    const jobId = req.params.jobId;
    
    // Fetch job details for AI parsing
    let job = null;
    if (req.app.locals.dbConnected) {
      job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
    } else {
      job = mockJobs.find(j => j._id.toString() === jobId) || mockJobs[0] || { title: "Demo Job", salaryRange: "N/A", skillsRequired: [] };
    }

    const file = req.file;
    let resumeUrl = "NO_URL_GENERATED";
    
    if (file) {
      const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                           !process.env.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name');
      
      if (hasCloudinary) {
         const result = await cloudinary.uploader.upload(file.path, { resource_type: "raw" });
         resumeUrl = result.secure_url;
         
         // Clean up local temp file only after successful upload to Cloudinary
         if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
         }
      } else {
         const host = req.get('host');
         const protocol = req.protocol;
         resumeUrl = `${protocol}://${host}/uploads/${file.filename}`;
      }
    }

    // AI Parsing & Scoring
    const aiResult = file ? await parseResumeAndScore(file.path, job) : { score: 0, matchedSkills: [], missingSkills: [] };

    const application = {
      candidateName,
      candidateEmail,
      jobId,
      resumeUrl,
      aiScore: aiResult.score,
      aiMatchedSkills: aiResult.matchedSkills,
      aiMissingSkills: aiResult.missingSkills,
      status: "Applied",
      appliedAt: new Date()
    };
    
    if (req.app.locals.dbConnected) {
      const newApp = new Application(application);
      await newApp.save();
      return res.status(201).json({ message: "Application submitted successfully", application: newApp });
    }
    
    // In Demo Mode, simulate a successful save
    application._id = "demo-" + Date.now();
    application.jobId = job; // attach job to the mock app for UI needs
    return res.status(201).json({ message: "Application submitted successfully (Demo Mode)", application });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Application Status (HR only)
router.put("/:appId/status", authorize("HR"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!req.app.locals.dbConnected) {
      return res.status(503).json({ message: "Database not connected. Cannot update status in Demo Mode." });
    }
    const application = await Application.findByIdAndUpdate(req.params.appId, { status }, { new: true }).populate('jobId');
    if (!application) return res.status(404).json({ message: "Application not found" });
    
    // Email automation
    let attachmentData = null;
    if (status === "Selected" && application.jobId) {
      attachmentData = await generateOfferLetter(application.candidateName, application.jobId.title, application.jobId.salaryRange);
    }

    if (application.jobId) {
       await sendStatusEmail(application.candidateEmail, application.candidateName, application.jobId.title, status, attachmentData);
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Applications per job (HR only)
router.get("/job/:jobId", authorize("HR"), async (req, res) => {
  try {
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    if (isDemoMode) {
      return res.json(mockApplications.filter(a => a.jobId === req.params.jobId));
    }
    const apps = await Application.find({ jobId: req.params.jobId }).sort({ aiScore: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get ALL Applications (HR Dashboard Stats)
router.get("/", authorize("HR"), async (req, res) => {
  try {
    const isDemoMode = req.app.locals.dbConnected === false || req.app.locals.dbConnected === undefined;
    if (isDemoMode) {
      return res.json(mockApplications);
    }
    const apps = await Application.find().sort({ appliedAt: -1 }).populate('jobId');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete Application (HR only)
router.delete("/:appId", authorize("HR"), async (req, res) => {
  try {
    if (!req.app.locals.dbConnected) {
      return res.json({ message: "Application deleted successfully (Demo Mode)" });
    }
    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // If local resume file exists, delete it
    if (application.resumeUrl && application.resumeUrl.includes('/uploads/')) {
        const urlParts = application.resumeUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await Application.findByIdAndDelete(req.params.appId);
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
