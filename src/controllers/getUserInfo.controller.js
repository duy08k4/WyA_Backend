// Import model
const getUserInfo_Model = require("../models/getUserInfo.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class getUserInfoController {
    async getInfo(req, res) {
        let requestMethod = req.method
        
        // [GET] /create-account
        switch (requestMethod) {
            case 'GET':
                const getUserInfo_respones = await getUserInfo_Model(req, res)
                return res.json(getUserInfo_respones)
        
            default:
                res.json(wrongMethod_response)
                break
        }
    }
}

module.exports = new getUserInfoController