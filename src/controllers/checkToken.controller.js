const checkToken_Model = require("../models/checkToken.model")
const jwt = require("jsonwebtoken")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class checkTokenController {
    // [POST] /friend-request/send
    async check(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const checkToken_response = await checkToken_Model(req, res)
                return res.json(checkToken_response)

            default:
                return res.json(wrongMethod_response)
        }
    }
}
module.exports = new checkTokenController() 