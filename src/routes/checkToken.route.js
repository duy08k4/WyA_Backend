// Import libraries
const express = require("express")
const checkTokenRouter = express.Router()

// Import controllers
const checkTokenController = require("../controllers/checkToken.controller")

// Set routes
checkTokenRouter.use("/", checkTokenController.check)

module.exports = checkTokenRouter