// Import libraries
const express = require("express")
const sendMessageRouter = express.Router()

// Import controller
const sendMessageController = require("../controllers/sendMessage.controller")

// Login route
sendMessageRouter.use("/merge", sendMessageController.mergeMessage)
sendMessageRouter.use("/remove-chat", sendMessageController.removeChat)
sendMessageRouter.use("/", sendMessageController.sendMessage)

module.exports = sendMessageRouter