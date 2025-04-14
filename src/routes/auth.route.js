// Import libraries
const express = require("express")
const authRouter = express.Router()

// Import middleware
const { refreshToken, authorizeLogin, authorize } = require("../middleware/auth.middleware")

// Route for token refresh
authRouter.post("/refresh-token", refreshToken)

// Route for checking authorization
authRouter.get("/check-auth", authorize, (req, res) => {
    return res.json({
        status: S,
        data: {
            mess: "User is authenticated",
            user: req.user
        }
    })
})

module.exports = authRouter
