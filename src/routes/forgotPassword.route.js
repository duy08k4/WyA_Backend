const express = require("express")
const forgotPasswordRouter = express.Router()
const forgotPasswordController = require("../controllers/forgotPassword.controller")

// Friend request routes with authentication
forgotPasswordRouter.use("/sendOTP", forgotPasswordController.forgotPassword_sendOTP)
forgotPasswordRouter.use("/", forgotPasswordController.forgotPassword)

module.exports = forgotPasswordRouter

// danh sách bạn bè có dạng array và mỗi phần tử là 1 string, cụ thể là gmail