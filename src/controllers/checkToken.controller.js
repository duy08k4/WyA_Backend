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
    // [GET] /check-token
    async check(req, res) {
        let requestMethod = req.method
        
        switch (requestMethod) {
            case "GET":
                const checkToken_response = await checkToken_Model(req, res)
                break

            default:
                return res.json(wrongMethod_response)
        }
    }
}
module.exports = new checkTokenController() 