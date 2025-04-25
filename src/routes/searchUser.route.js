// Import libraries
const express = require("express")
const searchUserRouter = express.Router()

// Import controller
const searchUserController = require("../controllers/searchUser.controller")

// Login route
searchUserRouter.use("/", searchUserController.search)

module.exports = searchUserRouter