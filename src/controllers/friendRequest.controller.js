const { sendFriendRequest_Model, revokeFriendRequest_Model, acceptFriendRequest_Model, removeFriend_Model } = require("../models/friendRequest.model")
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
                const sendFriendRequest_response = await sendFriendRequest_Model(req, res)
                return res.json(sendFriendRequest_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /friend-request/revoke
    async revokeRequest(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const revokeFriendRequest_response = await revokeFriendRequest_Model(req, res)
                return res.json(revokeFriendRequest_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /friend-request/accept
    async acceptRequest(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const acceptFriendRequest_response = await acceptFriendRequest_Model(req, res)
                return res.json(acceptFriendRequest_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /friend-request/remove
    async removeFriend(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const removeFriend_response = await removeFriend_Model(req, res)
                return res.json(removeFriend_response)

            default:
                return res.json(wrongMethod_response)
        }
    }
}
module.exports = new friendRequestController() 