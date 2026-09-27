const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async function (req, res) {

    try {
        const { fullName, email, password } = req.body;

        // Check whether all required fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }

});


// LOGIN ROUTE
router.post("/login", async function (req, res) {

    try {
        const { email, password } = req.body;

        // Check whether email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare entered password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        // If password is incorrect
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

       // Create JWT token
const token = jwt.sign(
    {
        userId: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

// Login successful
res.status(200).json({
    success: true,
    message: "Login successful",
    token: token,
    user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    }
});

    } catch (error) {

        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }

});


module.exports = router;