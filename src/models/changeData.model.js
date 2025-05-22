const { FieldValue } = require("firebase-admin/firestore")
const hs256 = require("js-sha256")
const db = require("../config/firebaseSDK")

const sendOtp__backend = require("../models/sendOtp__backend.model")
const verifyOtp__backend_Model = require("../models/verifyOtp.model__backend")

const changeData_Model = async (req, res) => {
    const data = req.body.data
    const changeType = data.typeChange
    const batch = db.batch()
    const client_password = data.client_password
    const client_mail = data.client_mail
    const userRef = await db.collection("accounts").doc(btoa(client_mail)).get()

    if (!userRef.exists) {
        return {
            status: 401,
            data: {
                mess: "Can't proccess"
            }
        }
    } else if (hs256(client_password) != userRef.data().password) {
        return {
            status: 401,
            data: {
                mess: "Can't proccess"
            }
        }
    } else {
        if (changeType == "changeName") {
            const client_mail = data.client_mail
            const client_newName = data.client_newName

            if (client_mail && client_newName) {
                batch.set(db.collection("userInformation").doc(btoa(client_mail)), {
                    username: client_newName
                }, { merge: true })

                const changeData__response = batch.commit().then(() => {
                    return {
                        status: 200,
                        data: {
                            mess: "Changed name"
                        }
                    }
                }).catch((err) => {
                    console.log(`ERROR<change-data>: ${err}`)
                    return {
                        status: 401,
                        data: {
                            mess: "Can't proccess"
                        }
                    }
                })

                return changeData__response
            } else {
                return {
                    status: 401,
                    data: {
                        mess: "Can't proccess"
                    }
                }
            }
        }

        if (changeType == "changePasword") {
            const client_mail = data.client_mail
            const client_newPassword = data.client_newPassword

            if (client_mail && client_newPassword) {
                batch.set(db.collection("accounts").doc(btoa(client_mail)), {
                    password: hs256(client_newPassword)
                }, { merge: true })

                const changeData__response = batch.commit().then(() => {
                    return {
                        status: 200,
                        data: {
                            mess: "Changed password"
                        }
                    }
                }).catch((err) => {
                    console.log(`ERROR<change-data>: ${err}`)
                    return {
                        status: 401,
                        data: {
                            mess: "Can't proccess"
                        }
                    }
                })

                return changeData__response

            } else {
                return {
                    status: 401,
                    data: {
                        mess: "Can't proccess"
                    }
                }
            }
        }

        return {
            status: 401,
            data: {
                mess: "Can't proccess"
            }
        }
    }
}

const deleteAccount__sendVerifyCode__Model = async (req, res) => {
    const data = req.body.data
    const clientGmail = data.client_mail

    if (clientGmail) {
        await sendOtp__backend(req, res, clientGmail).then(() => {
            return res.json({
                status: 200,
                data: {
                    mess: "OTP sent !"
                }
            })
        }).catch(() => {
            return res.json({
                status: 401,
                data: {
                    mess: "Can't send OTP"
                }
            })
        })
    } else {
        return res.json({
            status: 401,
            data: {
                mess: "Can't send OTP"
            }
        })
    }

}

const deleteAccount = async (req, res) => {
    const data = req.body.data
    const batch = db.batch()
    const client_mail = data.client_mail
    const verifyCode = data.verifyCode

    if (client_mail) {
        const checkVerifyCode = verifyOtp__backend_Model(req, res, verifyCode)
        const userExistance = await db.collection("accounts").doc(btoa(client_mail)).get()

        if (userExistance.exists) {
            if (checkVerifyCode.status == 200) {
                // Delete user's information
                batch.delete(db.collection("accounts").doc(btoa(client_mail)))
                batch.delete(db.collection("userInformation").doc(btoa(client_mail)))
                batch.delete(db.collection("mapConnecttion").doc(btoa(client_mail)))
                batch.delete(db.collection("requestShareLocation").doc(btoa(client_mail)))
                batch.delete(db.collection("userActiveStatus").doc(btoa(client_mail)))

                batch.commit().then(() => {
                    return res.json({
                        status: 200,
                        data: {
                            mess: "Deleted account"
                        }
                    })
                }).catch((err) => {
                    console.log(`ERROR<change-data>: ${err}`)
                    return res.json({
                        status: 401,
                        data: {
                            mess: "Can't delete account"
                        }
                    })
                })
            } else {
                return res.json({
                    status: 401,
                    data: {
                        mess: "Can't delete account"
                    }
                })
            }
        } else {
            return res.json({
                status: 401,
                data: {
                    mess: "Can't delete account"
                }
            })
        }

    } else {
        return res.json({
            status: 401,
            data: {
                mess: "Can't proccess"
            }
        })
    }
}

module.exports = {
    changeData_Model,
    deleteAccount__sendVerifyCode__Model,
    deleteAccount
}