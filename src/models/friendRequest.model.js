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
            const ref = db.collection("userInformation")
            const senderDoc = await ref.doc(btoa(senderGmail)).get()
            const receiverDoc = await ref.doc(btoa(receiverGmail)).get()

            if (senderDoc.exists && receiverDoc) {
                const senderRef = db.collection("userInformation").doc(btoa(senderGmail))
                batch.update(senderRef, {
                    requests: FieldValue.arrayUnion({
                        type: "sender",
                        request_gmail: receiverGmail,
                        request_avartarCode: receiverDoc.data().avartarCode,
                        request_name: receiverDoc.data().username
                    })
                })
    
                const receiverRef = db.collection("userInformation").doc(btoa(receiverGmail))
                batch.update(receiverRef, {
                    requests: FieldValue.arrayUnion({
                        type: "receiver",
                        request_gmail: senderGmail,
                        request_avartarCode: receiverDoc.data().avartarCode,
                        request_name: senderDoc.data().username
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
                    status: 400,
                    data: {
                        mess: "Cant send"
                    }
                }
            }

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