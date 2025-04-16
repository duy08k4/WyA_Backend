// Import model
const loginAccount_Model = require("../models/loginAccount.model")
const jwt = require("jsonwebtoken")

// Controller
class LoginController {
    // [POST] /login-account
    async loginAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const loginAccount_respones = await loginAccount_Model(req, res)
                return res.json(loginAccount_respones)

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