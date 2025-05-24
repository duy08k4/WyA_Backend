const jwt = require("jsonwebtoken")
const db = require("../config/firebaseSDK")

const getUserInfo_Model = async (req, res) => {
    const getAccToken = req.cookies[process.env.ACCTOKEN_COOKIE_NAME]

    const gmail = jwt.verify(getAccToken, process.env.SCKEY, (err, decoded) => {
        if (!err) {
            return decoded.gmail
        } else return undefined
    })

    if (gmail) {
        const userData = await db.collection("userInformation").doc(btoa(gmail)).get()
        if (userData.exists) {
            return {
                status: 200,
                data: {
                    userData: userData.data(),
                    mess: "Got user data"
                }
            }
        } else {
            return {
                status: 404,
                data: {
                    mess: "Request denied"
                }
            }
        }
    } else {
        return {
            status: 498,
            data: {
                mess: "Token is expired"
            }
        }
    }

}

module.exports = getUserInfo_Model