const jwt = require("jsonwebtoken")
const db = require("../config/firebaseSDK")

const getChatData_Model = async (req, res) => {
    const getAccessToken = req.cookies[process.env.ACCTOKEN_COOKIE_NAME] ? req.cookies[process.env.ACCTOKEN_COOKIE_NAME] : undefined

    if (getAccessToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, async (err, decoded) => {
            if (err) {
                return res.json({
                    status: 498,
                    data: {
                        mess: "Token is expired"
                    }
                })
            } else {
                const userGmail = decoded.gmail
                const userRef = await db.collection("userInformation").doc(btoa(userGmail)).get()

                if (!userRef.exists) {
                    return res.json({
                        status: 498,
                        data: {
                            mess: "Token is expired"
                        }
                    })
                } else {
                    const userData = userRef.data()
                    const listFriend = userData.friends.list //Output: Type Array
                    const listRequest = userData.requests //Output: Type Array

                    console.log(listFriend)
                    console.log(listRequest)
                    return res.json({
                        status: 200,
                        data: {
                            mess: "Got"
                        }
                    })
                }
            }
        })

    } else {
        return res.json({
            status: 498,
            data: {
                mess: "False branch"
            }
        })
    }
}

module.exports = getChatData_Model