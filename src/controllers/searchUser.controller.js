// Import model
const searchUser_Model = require("../models/searchUser.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

class SearchUserController {
    // [POST]: /searh-user
    async search (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'POST':
                const searchUser_response = await searchUser_Model(req, res)
                return res.json(searchUser_response)
        
            default:
                return res.json(wrongMethod_response)
        }
    }
}

module.exports = new SearchUserController