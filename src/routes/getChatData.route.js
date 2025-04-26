// Import libraries
const express = require("express")
const getChatData = express.Router()

// Import controller
const getChatDataController = require("../controllers/getChatData.controller")

// Login route
getChatData.use("/", getChatDataController.getInfo)

module.exports = getChatData