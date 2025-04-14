// Import model
const createAccount_Model = require("../models/createAccount.model")

// Controller
class RegisterController {
    // [POST] /create-account
    async createAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const inputData = req.body.data
                console.log(req.body)
                const createAccount_response = await createAccount_Model(inputData)

                return res.json(createAccount_response)
        
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

module.exports = new RegisterController