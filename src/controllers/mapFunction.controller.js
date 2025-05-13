// Import model
const {
    sendRequestShareLocation_Model,
    revokeRequestShareLocation_Model,
    acceptRequestShareLocation_Model,
    disconnectShareLocation_Model

} = require("../models/mapFunction.model")

// Response when got wrong method
const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class MapFunctionController {
    // [POST] /map-function/revoke-request
    async revokeRequestShareLocation(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const revokeRequestShareLocation_response = await revokeRequestShareLocation_Model(req, res)
                return res.json(revokeRequestShareLocation_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /map-function/accept-request
    async acceptRequestShareLocation(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const acceptRequestShareLocation_response = await acceptRequestShareLocation_Model(req, res)
                return res.json(acceptRequestShareLocation_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /map-function
    async sendRequestShareLocation(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const sendRequestShareLocation_response = await sendRequestShareLocation_Model(req, res)
                return res.json(sendRequestShareLocation_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

     // [POST] /disconnect
    async disconnectShareLocation(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const disconnectShareLocation_response = await disconnectShareLocation_Model(req, res)
                return res.json(disconnectShareLocation_response)

            default:
                return res.json(wrongMethod_response)
        }
    }
}

module.exports = new MapFunctionController