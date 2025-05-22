const {
    changeData_Model,
    deleteAccount__sendVerifyCode__Model,
    deleteAccount
} = require("../models/changeData.model")
const jwt = require("jsonwebtoken")

const wrongMethod_response = {
    status: 405,
    data: {
        mess: "Wrong method"
    }
}

// Controller
class changeDataController {
    // [POST] /change-data
    async change(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const changeData_response = await changeData_Model(req, res)
                return res.json(changeData_response)

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /change-data/send-verifyCode
    async deleteAccount__sendVerifyCode(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const deleteAccount__sendVerifycation_response = await deleteAccount__sendVerifyCode__Model(req, res)
                break;

            default:
                return res.json(wrongMethod_response)
        }
    }

    // [POST] /change-data/delete-account
    async deleteAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const deleteAccount_response = await deleteAccount(req, res)
                break;

            default:
                return res.json(wrongMethod_response)
        }
    }
}
module.exports = new changeDataController() 