const { FieldValue } = require("firebase-admin/firestore")
const db = require("../config/firebaseSDK")

// Model
const friendRequestModel = async (req,res) => {
    const data = req.body.data
    const senderGmail = data.senderGmail
    const receiverGmail = data.receiverGmail

    if (senderGmail && receiverGmail) {
        if (senderGmail !== receiverGmail) {
            const senderRef = await db.collection("userInformation").doc(btoa(senderGmail)).update({
                requests: FieldValue.arrayUnion ({ 
                    type : "sender",
                    request_gmail: receiverGmail
                })
            }).then (() => { return true }).catch (() => { return false })

            const receiverRef = await db.collection("userInformation").doc(btoa(receiverGmail)).update({
                requests: FieldValue.arrayUnion ({ 
                    type : "receiver",
                    request_gmail: senderGmail
                })
            }).then (() => { return true }).catch (() => { return false })

            return {
                status : 200,
                data : {
                    mess : "Sent"
                }
            }
        } else {
            return {
                status : 404,
                data : {
                    mess : "Internal Error : Duplicated Gmail"
                }
            }
        }
        

    } else {
        return {
            status : 404,
            data : {
                mess : "Internal Error : Null value"
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

module.exports = friendRequestModel