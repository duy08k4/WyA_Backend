const friendRequestModel = require("../models/friendRequest.model")
const jwt = require("jsonwebtoken")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class friendRequestController {
    // [POST] /friend-request/send
    async sendRequest(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const friendRequest_response = await friendRequestModel(req, res)
                return res.json(friendRequest_response)

            default:
                return res.json(wrongMethod_response)
        }
    }
}
module.exports = new friendRequestController() 