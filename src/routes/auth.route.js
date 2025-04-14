// Import libraries
const express = require("express")
const authRouter = express.Router()

// Import middleware
const { refreshToken } = require("../middleware/auth.middleware")

// Route for token refresh
authRouter.post("/refresh-token", refreshToken)

module.exports = authRouter
