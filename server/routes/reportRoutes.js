const express = require("express");
const multer = require("multer");
const path = require("path");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Configure where uploaded files will be stored
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }

});


// Allow only PDF, JPG and PNG files
const fileFilter = function (req, file, cb) {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, JPG and PNG files are allowed"));
    }

};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


// Upload report
router.post(
    "/upload",
    authMiddleware,
    upload.single("report"),
    async function (req, res) {

        try {

            // Check whether a file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No report file uploaded"
                });
            }

            // Save report information in MongoDB
            const report = await Report.create({
                userId: req.user.userId,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: req.file.path
            });

            res.status(201).json({
                success: true,
                message: "Report uploaded successfully",
                report: {
                    id: report._id,
                    fileName: report.fileName,
                    fileType: report.fileType,
                    createdAt: report.createdAt
                }
            });

        } catch (error) {

            console.error("Report upload error:", error.message);

            res.status(500).json({
                success: false,
                message: "Server error while uploading report"
            });

        }

    }
);


module.exports = router;