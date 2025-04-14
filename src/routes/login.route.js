// Import libraries
const express = require("express")
const loginRouter = express.Router()

// Import controller
const loginController = require("../controllers/login.controller")

loginRouter.use("/", loginController.login)

module.exports = loginRouter