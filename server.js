require("dotenv").config();
const express = require("express");
const cors=require("cors");
const connectDB = require("./config/db");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");
const reportRoutes = require("./routes/reportRoutes");

const authRoutes=require("./routes/authRoutes");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/test-protected", authMiddleware, function (req, res) {

    res.status(200).json({
        success: true,
        message: "You have access to this protected route",
        userId: req.user.userId
    });

});

const PORT = 5000;

app.get("/", function (req, res) {
    res.send("MediExplain AI server is running!");
});

app.get("/api/health", function (req, res) {

    res.json({
        success: true,
        message: "MediExplain AI API is healthy"
    });

});

app.post("/api/test", function (req,res){
    const data=req.body;
    res.json({
        success: true,
        received: data
    })
});




connectDB();

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);
});