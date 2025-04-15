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
                const inputData = req.body.data
                console.log(req.body)
                const loginAccount_response = await loginAccount_Model(inputData)

                // Generate JWT token if login successful
                if (loginAccount_response.status === 200) {
                    // Token with 15 minutes expiration
                    const token = jwt.sign(
                        { gmail: loginAccount_response.data.user.gmail },
                        JWT_SECRET,
                        { expiresIn: "15m" }
                    )

                    // Add token to response
                    loginAccount_response.data.token = token
                }

                return res.json(loginAccount_response)
        
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