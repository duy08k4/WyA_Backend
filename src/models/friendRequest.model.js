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
                // Check amount request
                const senderDoc_maxLimit = senderDoc.data().requests.length < parseInt(process.env.REQUEST_LIMIT) ? true : false
                const receiverDoc_maxLimit = receiverDoc.data().requests.length < parseInt(process.env.REQUEST_LIMIT) ? true : false

                if (senderDoc_maxLimit == false || receiverDoc_maxLimit == false) {
                    if (senderDoc_maxLimit == false) {
                        return {
                            status: 400,
                            data: {
                                mess: "Reached sending limit"
                            }
                        }
                    }

                    if (receiverDoc_maxLimit == false) {
                        return {
                            status: 400,
                            data: {
                                mess: `${receiverDoc.data().username} can't receive`
                            }
                        }
                    }
                } else {
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
                            request_avartarCode: senderDoc.data().avartarCode,
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
                }

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


// RevokeFriendRequest Model
const revokeFriendRequest_Model = async (req, res) => {
    const data = req.body.data
    const clientGmail = data.gmail
    const targetGmail = data.request_gmail

    if (clientGmail != targetGmail) {
        const ref = db.collection("userInformation")
        const clientDoc = await ref.doc(btoa(clientGmail)).get()
        const targetDoc = await ref.doc(btoa(targetGmail)).get()

        if (clientDoc.exists && targetDoc.exists) {
            const clientRequestList = clientDoc.data().requests
            const targetRequestList = targetDoc.data().requests

            const clientRequestList_length = clientRequestList.length
            const targetRequestList_length = targetRequestList.length

            const endpoitLoop = clientRequestList_length > targetRequestList_length ? clientRequestList_length : targetRequestList_length

            let clientInvitationIndex
            let targetInvitationIndex

            for (let i = 0; i < endpoitLoop; i++) {
                if (i < clientRequestList_length) {
                    const getClientInvitation = clientRequestList[i]

                    if (getClientInvitation.request_gmail == targetGmail) {
                        clientInvitationIndex = i
                    }
                }

                if (i < targetRequestList_length) {
                    const getTargetInvitation = targetRequestList[i]

                    if (getTargetInvitation.request_gmail == clientGmail) {
                        targetInvitationIndex = i
                    }
                }
            }

            // Remove invitaton
            clientRequestList.splice(clientInvitationIndex, 1)
            targetRequestList.splice(targetInvitationIndex, 1)

            // Update new request list
            const batch = db.batch()

            const clientReq = ref.doc(btoa(clientGmail))
            batch.update(clientReq, {
                requests: clientRequestList
            })

            const targetReq = ref.doc(btoa(targetGmail))
            batch.update(targetReq, {
                requests: targetRequestList
            })

            const reqult = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Revoked"
                    }
                }
            }).catch((err) => {
                console.log(err)
                return {
                    status: 404,
                    data: {
                        mess: "Can't revoke"
                    }
                }
            })

            return reqult

        } else {
            return {
                status: 404,
                data: {
                    mess: "Can't revoke"
                }
            }
        }

    } else {
        return {
            status: 404,
            data: {
                mess: "Can't revoke"
            }
        }
    }
}

// Accept request
function generateUniqueCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return timestamp + random;
}

const acceptFriendRequest_Model = async (req, res) => {
    const data = req.body.data
    const clientGmail = data.gmail
    const targetGmail = data.request_gmail

    if (clientGmail != targetGmail) {
        const ref = db.collection("userInformation")
        const clientDoc = await ref.doc(btoa(clientGmail)).get()
        const targetDoc = await ref.doc(btoa(targetGmail)).get()

        if (clientDoc.exists && targetDoc.exists) {
            const chatCode = generateUniqueCode()
            const batch = db.batch()

            const clientFriend = db.collection("userInformation").doc(btoa(clientGmail))
            batch.update(clientFriend, {
                requests: FieldValue.arrayRemove({
                    type: "receiver",
                    request_gmail: targetGmail,
                    request_avartarCode: data.request_avartarCode,
                    request_name: data.request_name
                }),
                friends: FieldValue.arrayUnion({
                    username: data.request_name,
                    gmail: data.request_gmail,
                    avartarCode: data.request_avartarCode,
                    chatCode
                }),
                listChatCode: FieldValue.arrayUnion({
                    gmail: targetGmail,
                    chatCode
                })
            })
            
            const targetFriend = db.collection("userInformation").doc(btoa(targetGmail))
            batch.update(targetFriend, {
                requests: FieldValue.arrayRemove({
                    type: "sender",
                    request_gmail: clientGmail,
                    request_avartarCode: data.avartarCode,
                    request_name: data.username
                }),
                friends: FieldValue.arrayUnion({
                    username: data.username,
                    gmail: clientGmail,
                    avartarCode: data.avartarCode,
                    chatCode
                }),
                listChatCode: FieldValue.arrayUnion({
                    gmail: clientGmail,
                    chatCode
                })
            })

            const result = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Add"
                    }
                }
            }).catch((err) => {
                console.log(err)
                return {
                    status: 404,
                    data: {
                        mess: "Can't accept"
                    }
                }
            })

            return result

        } else {
            return {
                status: 404,
                data: {
                    mess: "Can't accept"
                }
            }
        }

    } else {
        return {
            status: 404,
            data: {
                mess: "Can't accept"
            }
        }
    }
}

// RemoveFriend Model
const removeFriend_Model = async (req, res) => {
    const data = req.body.data

    const clientData = data.client
    const clientGmail = clientData.gmail

    const friendData = data.friend
    const friendGmail = friendData.gmail

    if (clientGmail != friendGmail) {
        const ref = db.collection("userInformation")
        const clientDoc = await ref.doc(btoa(clientGmail)).get()
        const friendDoc = await ref.doc(btoa(friendGmail)).get()

        if (clientDoc.exists && friendDoc.exists) {
            const batch = db.batch()

            batch.update(db.collection("userInformation").doc(btoa(clientGmail)), {
                friends: FieldValue.arrayRemove(friendData),
            })

            batch.update(db.collection("userInformation").doc(btoa(friendGmail)), {
                friends: FieldValue.arrayRemove(clientData),
            })

            const result = await batch.commit().then(() => {
                return {
                    status: 200,
                    data: {
                        mess: "Removed"
                    }
                }
            }).catch((err) => {
                console.log(err)
                return {
                    status: 404,
                    data: {
                        mess: "Can't remove"
                    }
                }
            })

            return result

        } else {
            return {
                status: 404,
                data: {
                    mess: "Can't remove"
                }
            }
        }

    } else {
        return {
            status: 404,
            data: {
                mess: "Can't remove"
            }
        }
    }
}


// const sendRequest = {
//     data : {
//         senderGmail: sender.Gmail,
//         reciverGmail: reciver.Gmail,
//         timeSent: createdTime(),
//     }
// }

module.exports = { sendFriendRequest_Model, revokeFriendRequest_Model, acceptFriendRequest_Model, removeFriend_Model } 