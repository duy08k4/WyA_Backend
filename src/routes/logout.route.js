// Import libraries
const express = require("express")
const logoutRouter = express.Router()

// Import controllers
const logoutController = require("../controllers/logout.controller")

// Set routes
logoutRouter.use("/", logoutController.signout)

module.exports = logoutRouter