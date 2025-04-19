// Import libraries
const express = require("express")
const registerRouter = express.Router()

// Import controller
const registerController = require("../controllers/register.controller")

registerRouter.use("/send-otp", registerController.sendOTP)
registerRouter.use("/verify-otp", registerController.verifyOTP)
registerRouter.use("/", registerController.createAccount)

module.exports = registerRouter