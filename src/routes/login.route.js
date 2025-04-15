// Import libraries
const express = require("express")
const loginRouter = express.Router()

// Import controller
const loginController = require("../controllers/login.controller")

// Import middleware
const { verifyToken } = require("../middleware/authorization")

// Login route
loginRouter.use("/", loginController.loginAccount)

// Test protected route
// loginRouter.get("/protected", verifyToken, (req, res) => {
//     res.json({
//         status: 200,
//         data: {
//             mess: "Protected route accessed successfully",
//             user: req.user
//         }
//     })
// })

module.exports = loginRouter