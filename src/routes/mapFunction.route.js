// Import libraries
const express = require("express")
const mapFunctionRouter = express.Router()

// Import controllers
const mapFunctionController = require("../controllers/mapFunction.controller")

// Set routes
mapFunctionRouter.use("/disconnect", mapFunctionController.disconnectShareLocation)
mapFunctionRouter.use("/revoke-request", mapFunctionController.revokeRequestShareLocation)
mapFunctionRouter.use("/accept-request", mapFunctionController.acceptRequestShareLocation)
mapFunctionRouter.use("/", mapFunctionController.sendRequestShareLocation)

module.exports = mapFunctionRouter