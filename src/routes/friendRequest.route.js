const express = require("express")
const friendRequestRouter = express.Router()
const friendRequestController = require("../controllers/friendRequest.controller")
const authorize = require("../middlewares/authenticate")

// Friend request routes with authentication
friendRequestRouter.use("/send", authorize, friendRequestController.sendRequest)
// friendRequestRouter.use("/accept", authorize, friendRequestController.acceptRequest)
// friendRequestRouter.use("/reject", authorize, friendRequestController.rejectRequest)

module.exports = friendRequestRouter