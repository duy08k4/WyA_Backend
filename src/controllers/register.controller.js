const db = require("../config/firebaseSDK")

class RegisterController {
    // [POST] /create-account
    createAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                return res.json({
                    status: 200,
                    data: {
                        mes: "Got it !!"
                    }
                })
        
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