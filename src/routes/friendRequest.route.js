const express = require("express")
const friendRequestRouter = express.Router()
const friendRequestController = require("../controllers/friendRequest.controller")

// Friend request routes with authentication
friendRequestRouter.use("/send", friendRequestController.sendRequest)
friendRequestRouter.use("/revoke", friendRequestController.revokeRequest)
friendRequestRouter.use("/accept", friendRequestController.acceptRequest)
friendRequestRouter.use("/remove", friendRequestController.removeFriend)

module.exports = friendRequestRouter

// danh sách bạn bè có dạng array và mỗi phần tử là 1 string, cụ thể là gmail