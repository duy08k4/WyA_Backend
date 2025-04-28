const { FieldValue } = require("firebase-admin/firestore")
const db = require("../config/firebaseSDK")

// SendFriendRequest Model
const sendFriendRequest_Model = async (req, res) => {
    const data = req.body.data
    const senderGmail = data.senderGmail
    const receiverGmail = data.receiverGmail
    const batch = db.batch()

    if (senderGmail && receiverGmail) {
        if (senderGmail !== receiverGmail) {
            const senderRef = db.collection("userInformation").doc(btoa(senderGmail))
            batch.update(senderRef, {
                requests: FieldValue.arrayUnion({
                    type: "sender",
                    request_gmail: receiverGmail
                })
            })

            const receiverRef = db.collection("userInformation").doc(btoa(receiverGmail))
            batch.update(receiverRef, {
                requests: FieldValue.arrayUnion({
                    type: "receiver",
                    request_gmail: senderGmail
                })
            })

            const result = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Sent"
                    }
                }
            }).catch(() => {
                return {
                    status: 400,
                    data: {
                        mess: "Cant send"
                    }
                }
            })

            return result
            
        } else {
            return {
                status: 404,
                data: {
                    mess: "Internal Error : Duplicated Gmail"
                }
            }
        }


    } else {
        return {
            status: 404,
            data: {
                mess: "Internal Error : Null value"
            }
        }
    }


}

// const sampleData = {
//     data : {
//         senderGmail: sender.Gmail,
//         reciverGmail: reciver.Gmail,
//         timeSent: createdTime(),
//     }
// }

module.exports = { sendFriendRequest_Model } 