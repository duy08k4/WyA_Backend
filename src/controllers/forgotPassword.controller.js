// Import model
const { forgotPassword_Model, forgotPassword_sendOTP_Model } = require("../models/forgotPassword.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class forgotPasswordController {
    async forgotPassword_sendOTP(req, res) {
        let requestMethod = req.method
        
        // [POST] /forgot-password/sendOTP
        switch (requestMethod) {
            case 'POST':
                const forgotPassword_sendOTP_respones = await forgotPassword_sendOTP_Model(req, res)
                break

            default:
                res.json(wrongMethod_response)
                break
        }
    }

    async forgotPassword(req, res) {
        let requestMethod = req.method
        
        // [POST] /forgot-password
        switch (requestMethod) {
            case 'POST':
                const forgotPassword_respones = await forgotPassword_Model(req, res)
                break
                
            default:
                res.json(wrongMethod_response)
                break
        }
    }
}

module.exports = new forgotPasswordController