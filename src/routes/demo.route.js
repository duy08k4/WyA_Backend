// Import libraries
const express = require("express")
const router = express.Router()

// Import controllers
const demoController = require("../controllers/demo.controller")

// Set routes
router.use("/", demoController.showContent)
router.use("/more", demoController.showContentMore)

module.exports = router