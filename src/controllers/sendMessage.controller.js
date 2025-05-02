// Import model
const { sendMessage_Model, mergeMessage_Model, removeChat_Model } = require("../models/sendMessage.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

class SendMessageController {
    // [POST]: /send-message
    async sendMessage (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'POST':
                const sendMessage_response = await sendMessage_Model(req, res)
                return res.json(sendMessage_response)
        
            default:
                console.log("OK")
                return res.json(wrongMethod_response)
        }
    }

    // [POST]: /send-message/merge
    async mergeMessage (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'POST':
                const mergeMessage_response = await mergeMessage_Model(req, res)
                return res.json(mergeMessage_response)
        
            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST]: /send-message/remove-chat
    async removeChat (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'POST':
                const removeChat_response = await removeChat_Model(req, res)
                return res.json(removeChat_response)
        
            default:
                return res.json(wrongMethod_response)
        }
    }
}

module.exports = new SendMessageController