// Import libraries
const { v4 } = require("uuid")
const sendOtp__backend = require("./sendOtp__backend.model")
const verifyOtp__backend_Model = require("./verifyOtp.model__backend")

// Import database
const db = require("../config/firebaseSDK")
const hs256 = require("js-sha256")

// ForgotPassword Send OTP
const forgotPassword_sendOTP_Model = async (req, res) => {
    const data = req.body.data
    const gmail = data.gmail

    const userRef = await db.collection("accounts").doc(btoa(gmail)).get()

    if (userRef.exists) {

        await sendOtp__backend(req, res, gmail, 3, "FORGOT PASSWORD").then((data) => {
            if (data.status == 200) {
                return res.json({
                    status: 200,
                    data: {
                        mess: "OTP sent !"
                    }
                })
            } else {
                return res.json({
                    status: 404,
                    data: {
                        mess: "Can't send OTP"
                    }
                })
            }
        }).catch((error) => {
            console.log(`ERROR<forgotPassword-sendOTP>: ${error}`)
            return res.json({
                status: 404,
                data: {
                    mess: "Can't send OTP"
                }
            })
        })


    } else {
        return res.json({
            status: 404,
            data: {
                mess: "Account does not exists"
            }
        })
    }
}


// ForgotPassword_Model
const forgotPassword_Model = async (req, res) => {
    const data = req.body.data
    const gmail = data.gmail
    const newPassword = atob(data.newPassword)
    const verifyCode = data.verifyCode
    const response_verifyCode = verifyOtp__backend_Model(req, res, verifyCode)

    const userRef = await db.collection("accounts").doc(btoa(gmail)).get()

    if (userRef.exists) {

        if (response_verifyCode.status == 200) {
            const batch = db.batch()

            batch.update(db.collection("accounts").doc(btoa(gmail)), {
                password: hs256(newPassword)
            })

            batch.commit().then(() => {
                return res.json({
                    status: 200,
                    data: {
                        mess: "Password changed"
                    }
                })
            }).catch((error) => {
                console.log(`ERROR<forgotpassword>: ${error}`)
                return res.json({
                    status: 401,
                    data: {
                        mess: "Can't change password"
                    }
                })
            })
        } else {
            return res.json({
                status: 401,
                data: {
                    mess: "Can't change password"
                }
            })
        }

    } else {
        return res.json({
            status: 404,
            data: {
                mess: "Account does not exists"
            }
        })
    }
}

module.exports = {
    forgotPassword_sendOTP_Model,
    forgotPassword_Model
}