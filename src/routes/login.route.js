// Import libraries
const express = require("express")
const loginRouter = express.Router()

// Import controller
const loginController = require("../controllers/login.controller")

// Handle login route
loginRouter.post("/", loginController.loginAccount)

module.exports = loginRouter