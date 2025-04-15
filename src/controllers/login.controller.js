// Import model
const loginAccount_Model = require("../models/loginAccount.model")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../middleware/authorization")

// Controller
class LoginController {
    // [POST] /login-account
    async loginAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                await loginAccount_Model(req, res)

            default: 
            return res.json({
                status: 405,
                data: {
                    mess: "Wrong method"
                }
            })
        }
    }
}

module.exports = new LoginController