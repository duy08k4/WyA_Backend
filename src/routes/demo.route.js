// Import libraries
const express = require("express")
const demoRouter = express.Router()

// Import controllers
const demoController = require("../controllers/demo.controller")

// Set routes
demoRouter.use("/", demoController.showContent)
demoRouter.use("/more", demoController.showContentMore)

module.exports = demoRouter