// Import libraries
const express = require("express")
const contactRouter = express.Router()

// Import controllers
const contactController = require("../controllers/contact.controller")

// Set routes
contactRouter.use("/", contactController.send)

module.exports = contactRouter