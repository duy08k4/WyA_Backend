// Import model
const getChatData_Model = require("../models/getChatData.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class getChatDataController {
    async getInfo(req, res) {
        let requestMethod = req.method
        
        // [GET] /data-chat
        switch (requestMethod) {
            case 'GET':
                await getChatData_Model(req, res)
                break

            default:
                res.json(wrongMethod_response)
                break
        }
    }
}

module.exports = new getChatDataController