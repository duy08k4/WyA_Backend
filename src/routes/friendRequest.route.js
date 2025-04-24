const express = require("express")
const friendRequestRouter = express.Router()
const friendRequestController = require("../controllers/friendRequest.controller")

// Friend request routes with authentication
friendRequestRouter.use("/send", friendRequestController.sendRequest)
// friendRequestRouter.use("/accept", authorize, friendRequestController.acceptRequest)
// friendRequestRouter.use("/reject", authorize, friendRequestController.rejectRequest)

module.exports = friendRequestRouter