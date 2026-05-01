const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const Resume = require("../models/Resume");

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ATS Score function
const calculateScore = (resume, jd) => {

    const resumeWords = resume.toLowerCase().split(" ");
    const jdWords = jd.toLowerCase().split(" ");

    let matchCount = 0;

    jdWords.forEach(word => {
        if (resumeWords.includes(word)) {
            matchCount++;
        }
    });

    return Math.round((matchCount / jdWords.length) * 100);
};

// Single upload route (FINAL)
router.post("/upload", upload.single("resume"), async (req, res) => {

    try {

        const jobDescription = req.body.jd;

        if (!req.file) {
            return res.status(400).json({ message: "No resume uploaded" });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);

        const resumeText = data.text;

        const score = calculateScore(resumeText, jobDescription);
        await Resume.create({
           resumeText,
           jobDescription,
           score
      });

      const generateFeedback = (score) => {

           if(score > 80)
             return "Strong resume match";

           if(score > 60)
              return "Good resume but needs improvement";

      return "Add more relevant keywords";
};

        res.json({
            message: "Resume processed successfully",
            score,
            feedback: generateFeedback(score),
            resumeText,
            jobDescription
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing resume" });
    }

});

module.exports = router;