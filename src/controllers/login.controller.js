// Import model
const loginAccount_Model = require("../models/loginAccount.model")

// Controller
class loginController {
    // [POST] /login-account
    async loginAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const inputData = req.body.data
                console.log(req.body)
                const loginAccount_response = await loginAccount_Model(inputData)

                return res.json(loginAccount_response)
        
            default:
                return res.json({
                    status: 405,
                    data: {
                        mes: "Wrong method"
                    }
                })
        }
    }
}

module.exports = new LoginController