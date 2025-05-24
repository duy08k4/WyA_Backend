// Import model
const contact_Model = require("../models/contact.model")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class contactController {
    async send(req, res) {
        let requestMethod = req.method
        
        // [POST] /contact
        switch (requestMethod) {
            case 'POST':
                const contact_respones = await contact_Model(req, res)
                break

            default:
                res.json(wrongMethod_response)
                break
        }
    }
}

module.exports = new contactController