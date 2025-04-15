// Import libraries
const jwt = require("jsonwebtoken")

// Secret key for JWT
const JWT_SECRET = process.env.SCKEY

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({
            status: 404,
            data: {
                mess: "Unsuccessful"
            }
        })
    }
    
    // Extract token from header
    const token = authHeader.split(" ")[1]
    
    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET)
        
        // Add user info to request
        req.user = decoded
        next()
    } catch (error) {
        return res.json({
            status: 401,
            data: {
                mess: "Unsuccessful"
            }
        })
    }
}

module.exports = { verifyToken, JWT_SECRET }