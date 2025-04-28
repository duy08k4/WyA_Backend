const logoutAccount_Model = require("../models/logoutAccount.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

class LogoutController {
    // [GET]: /logout-account
    async signout(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "GET":
                const logoutAccount_respones = await logoutAccount_Model(req, res)
                return res.json(logoutAccount_respones)

            default:
                return res.json(wrongMethod_response)
        }
    }
}

module.exports = new LogoutController