const express = require("express");
const connectDB = require("./config/db");
const app = express();


const authRoutes=require("./routes/authRoutes");

app.use(express.json());

app.use("/api/auth", authRoutes);

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