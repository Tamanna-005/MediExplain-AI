const express = require("express");
const multer = require("multer");
const path = require("path");
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
    function (req, res) {

        res.status(200).json({
            success: true,
            message: "Report uploaded successfully",
            userId: req.user.userId,
            file: {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: req.file.path
            }
        });

    }
);


module.exports = router;