// Import model
const createAccount_Model = require("../models/createAccount.model")
const sendOtp_Model = require("../models/sendOtp.model")
const verifyOtp_Model = require("../models/verifyOtp.model")

// Response when got wrong method
const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class RegisterController {
    // [POST] /create-account
    async createAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const createAccount_response = await createAccount_Model(req, res)
                return res.json(createAccount_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /create-account/send-otp
    async sendOTP(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const sendOtp_response = await sendOtp_Model(req, res)
                return res.json(sendOtp_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /create-account/verify-otp
    async verifyOTP(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const verifyOtp_response = verifyOtp_Model(req, res)
                return res.json(verifyOtp_response)

            default:
                return res.json(wrongMethod_response)
        }
    }
}

module.exports = new RegisterController