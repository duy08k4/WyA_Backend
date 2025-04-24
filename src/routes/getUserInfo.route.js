// Import libraries
const express = require("express")
const getUserInfoRouter = express.Router()

// Import controller
const getUserInfoController = require("../controllers/getUserInfo.controller")

// Login route
getUserInfoRouter.use("/", getUserInfoController.getInfo)

module.exports = getUserInfoRouter