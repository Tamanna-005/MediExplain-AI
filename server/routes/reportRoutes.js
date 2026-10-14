const express = require("express");
const multer = require("multer");
const path = require("path");
const Report = require("../models/Report");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs/promises");

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


 // Get report history for the logged-in user
router.get("/", authMiddleware, async function (req, res) {
    try {
        const reports = await Report.find({
            userId: req.user.userId
        })
        .select("-filePath")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reports: reports
        });

    } catch (error) {
        console.error("Report history error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error while fetching report history"
        });
    }
});


 // View an uploaded report belonging to the logged-in user
router.get("/:id/view", authMiddleware, async function (req, res) {
    try {
        if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID"
            });
        }

        const report = await Report.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            path.basename(report.filePath)
        );

        // Confirm the stored file exists
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({
                success: false,
                message: "Report file not found on the server"
            });
        }

        // Serve only supported file types
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(report.fileType)) {
            return res.status(415).json({
                success: false,
                message: "Unsupported report file type"
            });
        }

        res.setHeader("Content-Type", report.fileType);
        res.setHeader(
            "Content-Disposition",
            `inline; filename="report-${report._id}${report.fileType === "application/pdf" ? ".pdf" : report.fileType === "image/jpeg" ? ".jpg" : ".png"}"`
        );
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cache-Control", "private, no-store");

        return res.sendFile(filePath);

    } catch (error) {
        console.error("View report error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while opening report"
        });
    }
});



 // Delete a report belonging to the logged-in user
router.delete("/:id", authMiddleware, async function (req, res) {
    try {
        if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID"
            });
        }

        const report = await Report.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            path.basename(report.filePath)
        );

        // Remove the stored file if it exists
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        // Remove the report record from MongoDB
        await report.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Report deleted successfully"
        });

    } catch (error) {
        console.error("Report deletion error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting report"
        });
    }
});


module.exports = router;