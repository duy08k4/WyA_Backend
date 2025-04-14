// Import libraries
const express = require("express")
const demoRouter = express.Router()

// Import controllers
const demoController = require("../controllers/demo.controller")

// Set routes
demoRouter.use("/more", demoController.showContentMore)
demoRouter.use("/", demoController.showContent)

module.exports = demoRouter