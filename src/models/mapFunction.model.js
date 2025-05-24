const { FieldValue } = require("firebase-admin/firestore")
const db = require("../config/firebaseSDK")

// Model sendRequestShareLocation
const sendRequestShareLocation_Model = async (req, res) => {
    const data = req.body.data
    const clientGmail = data.clientGmail
    const clientName = data.clientName
    const clientAvartarCode = data.clientAvartarCode
    const requestGmail = data.request_gmail
    const requestName = data.request_name
    const requestAvartarcode = data.request_avartarCode

    if (clientGmail != "" && requestGmail != "") {
        const batch = db.batch()

        batch.set(db.collection("requestShareLocation").doc(btoa(clientGmail)), {
            [btoa(requestGmail)]: {
                type: "sender",
                gmail: requestGmail,
                username: requestName,
                avartarCode: requestAvartarcode
            }
        }, { merge: true })

        batch.set(db.collection("requestShareLocation").doc(btoa(requestGmail)), {
            [btoa(clientGmail)]: {
                type: "receiver",
                gmail: clientGmail,
                username: clientName,
                avartarCode: clientAvartarCode
            }
        }, { merge: true })

        const result = await batch.commit().then(() => {
            return {
                status: 200,
                data: {
                    mess: "Sent"
                }
            }

        }).catch(() => {
            console.log("Error<mapFunction>: Can't send reequest for sharing location")
            return {
                status: 404,
                data: {
                    mess: "Can't send request"
                }
            }
        })

        return result


    } else {
        return {
            status: 404,
            data: {
                mess: "Can't send request"
            }
        }

    }
}

// Revoke request share location
const revokeRequestShareLocation_Model = async (req, res) => {
    let data = req.body.data

    const clientGmail = data.clientGmail
    const request_gmail = data.request_gmail

    if (clientGmail && request_gmail) {
        if (clientGmail != request_gmail) {
            const batch = db.batch()

            batch.update(db.collection("requestShareLocation").doc(btoa(clientGmail)), {
                [btoa(request_gmail)]: FieldValue.delete()
            })

            batch.update(db.collection("requestShareLocation").doc(btoa(request_gmail)), {
                [btoa(clientGmail)]: FieldValue.delete()
            })

            const result = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Revoked "
                    }
                }
            }).catch((err) => {
                console.log(`ERROR<revoke-request-share-location>: ${err}`)
                return {
                    status: 404,
                    data: {
                        mess: "Can't revoke your request "
                    }
                }
            })

            return result

        } else {
            console.log("ERROR<revoke-request-share-location>: Client'gmail same Target'gmail")
            return {
                status: 404,
                data: {
                    mess: "Can't revoke your request "
                }
            }
        }

    } else {
        console.log("ERROR<revoke-request-share-location>: No data")
        return {
            status: 404,
            data: {
                mess: "Can't revoke your request "
            }
        }
    }
}

// accept RequestShareLocation
const acceptRequestShareLocation_Model = async (req, res) => {
    const data = req.body.data

    const clientGmail = data.clientGmail
    const clientName = data.clientName
    const clientAvartarCode = data.clientAvartarCode

    const request_gmail = data.request_gmail
    const request_username = data.request_username
    const request_avartarCode = data.request_avartarCode

    if (clientGmail && clientName && request_gmail && request_username) {
        if (clientGmail != request_gmail) {
            const batch = db.batch()

            // Remove request
            batch.update(db.collection("requestShareLocation").doc(btoa(clientGmail)), {
                [btoa(request_gmail)]: FieldValue.delete()
            })

            batch.update(db.collection("requestShareLocation").doc(btoa(request_gmail)), {
                [btoa(clientGmail)]: FieldValue.delete()
            })

            // Add connection
            batch.set(db.collection("mapConnection").doc(btoa(clientGmail)), {
                [btoa(request_gmail)]: {
                    gmail: request_gmail,
                    username: request_username,
                    avartarCode: request_avartarCode
                }
            }, { merge: true })

            batch.set(db.collection("mapConnection").doc(btoa(request_gmail)), {
                [btoa(clientGmail)]: {
                    gmail: clientGmail,
                    username: clientName,
                    avartarCode: clientAvartarCode
                }
            }, { merge: true })

            const result = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Accepted "
                    }
                }
            }).catch((err) => {
                console.log(`ERROR<accept-request-share-location>: ${err}`)
                return {
                    status: 404,
                    data: {
                        mess: "Can't process your action"
                    }
                }
            })

            return result

        } else {
            console.log("ERROR<accept-request-share-location>: Client'gmail same Target'gmail")
            return {
                status: 404,
                data: {
                    mess: "Can't process your action"
                }
            }
        }
    } else {
        console.log("ERROR<accept-request-share-location>: No data")
        return {
            status: 404,
            data: {
                mess: "Can't process your action"
            }
        }
    }

}

// Disconnect
const disconnectShareLocation_Model = async (req, res) => {
    const data = req.body.data
    const disconnectType = data.type
    const clientGmail = data.clientGmail
    const targetConnection = data.targetConnection // Array type
    const batch = db.batch()

    if (disconnectType == "oneConnection") {
        const connection = targetConnection[0]
        const connectionGmail = connection.gmail

        batch.update(db.collection("mapConnection").doc(btoa(clientGmail)), {
            [btoa(connectionGmail)]: FieldValue.delete()
        })

        batch.update(db.collection("mapConnection").doc(btoa(connectionGmail)), {
            [btoa(clientGmail)]: FieldValue.delete()
        })

        const result_oneConnection = await batch.commit().then(() => {
            return {
                status: 200,
                data: {
                    mess: "Disconnected"
                }
            }
        }).catch((err) => {
            console.log(err)

            return {
                status: 404,
                data: {
                    mess: "Can't disconnect"
                }
            }
        })

        return result_oneConnection
    } else if (disconnectType == "allConnection") {

        targetConnection.forEach(val => {
            batch.update(db.collection("mapConnection").doc(btoa(val.gmail)), {
                [btoa(clientGmail)]: FieldValue.delete()
            })
            
            batch.update(db.collection("mapConnection").doc(btoa(clientGmail)), {
                [btoa(val.gmail)] : FieldValue.delete()
            })
        })


        const result_allConnection = await batch.commit().then(() => {
            return {
                status: 200,
                data: {
                    mess: "Disconnected"
                }
            }
        }).catch((err) => {
            console.log(err)
            return {
                status: 404,
                data: {
                    mess: "Can't disconnect"
                }
            }
        })

        return result_allConnection
    } else {
        return {
            status: 404,
            data: {
                mess: "Disconection's type is wrong"
            }
        }
    }
}

module.exports = {
    sendRequestShareLocation_Model,
    revokeRequestShareLocation_Model,
    acceptRequestShareLocation_Model,
    disconnectShareLocation_Model
}