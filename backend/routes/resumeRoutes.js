const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/upload", upload.single("resume"), (req, res) => {
    res.json({
        message: "Resume uploaded successfully",
        file: req.file
    });
});

router.post("/upload", upload.single("resume"), async (req, res) => {

    const dataBuffer = fs.readFileSync(req.file.path);

    const data = await pdfParse(dataBuffer);

    res.json({
        extractedText: data.text
    });

});

module.exports = router;