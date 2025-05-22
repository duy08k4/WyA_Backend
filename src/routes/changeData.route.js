// Import libraries
const express = require("express")
const changeDataRouter = express.Router()

// Import controllers
const changeDataController = require("../controllers/changeData.controller")

// Set routes
changeDataRouter.use("/send-verifyCode", changeDataController.deleteAccount__sendVerifyCode)
changeDataRouter.use("/delete-account", changeDataController.deleteAccount)
changeDataRouter.use("/", changeDataController.change)

module.exports = changeDataRouter