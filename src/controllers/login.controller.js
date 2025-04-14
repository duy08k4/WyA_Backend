//import model
const login_Model = require("../models/loginAccount.model")

//controller
class LoginController {
    //[POST] /login
    async login(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const inputData = req.body.data
                const login_response = await login_Model(inputData)

                return res.json(login_response)
            
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

module.exports = new LoginController()
