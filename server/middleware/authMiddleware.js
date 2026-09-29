const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if token was provided
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Expected format:
        // Authorization: Bearer <token>
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information in request
        req.user = decoded;

        // Continue to the protected route
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}

module.exports = authMiddleware;