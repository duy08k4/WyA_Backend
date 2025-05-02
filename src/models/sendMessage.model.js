const { FieldValue } = require("firebase-admin/firestore")
const jwt = require("jsonwebtoken")
const db = require("../config/firebaseSDK")

// Create time
function createdTime() {
    const time = new Date()
    const minute = time.getMinutes()
    const date = time.getDate().toString()
    const month = time.getMonth().toString()
    const year = time.getFullYear().toString()
    const hour = time.getHours().toString()

    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute} - ${date} THG ${month}, ${year}`
}

// Create unique code
function generateUniqueCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return timestamp + random;
}

// Model
const sendMessage_Model = async (req, res) => {
    const data = req.body.data
    const chatCode = data.chatCode
    const sender = data.sender
    const messageContent = data.content

    // Get new message
    const newMessRef = db.collection("newMessage")
    const newMessDoc = await newMessRef.doc(btoa(chatCode)).get()
    let recentSender
    let getAllNewMessages = []

    if (newMessDoc.exists) {
        if (newMessDoc.data().messages.length != 0) getAllNewMessages = newMessDoc.data().messages
        recentSender = newMessDoc.data().recentSender
    }

    // Send message
    const batch = db.batch()

    if (recentSender !== sender) {
        const chatRef = db.collection("chat").doc(btoa(chatCode))

        if (getAllNewMessages.length != 0) {
            batch.update(chatRef, { // Add message
                messages: FieldValue.arrayUnion(...getAllNewMessages)
            },
                { merge: true }
            )
        }

        batch.update(db.collection("newMessage").doc(btoa(chatCode)), {
            messages: []
        },
            { merge: true }
        )

        batch.update(db.collection("newMessage").doc(btoa(chatCode)), {
            recentSender: sender
        },
            { merge: true }
        )

    }

    batch.update(db.collection("newMessage").doc(btoa(chatCode)), {
        messages: FieldValue.arrayUnion({
            sender,
            messID: generateUniqueCode(),
            timestamp: createdTime(),
            content: messageContent
        })
    },
        { merge: true }
    )

    // Update new message for both user (cliet and targetUser)
    const targetGmail = data.targetGmail

    batch.update(db.collection("userInformation").doc(btoa(sender)), {
        [`lastMessages.${chatCode}`]: {
            sender,
            messID: generateUniqueCode(),
            timestamp: createdTime(),
            content: messageContent
        }
    },
        { merge: true }
    )

    batch.update(db.collection("userInformation").doc(btoa(targetGmail)), {
        [`lastMessages.${chatCode}`]: {
            sender,
            messID: generateUniqueCode(),
            timestamp: createdTime(),
            content: messageContent
        }
    },
        { merge: true }
    )

    // Purpose: active listener of firestore
    batch.update(db.collection("newMessage").doc(btoa(chatCode)), {
        active: btoa(generateUniqueCode())
    },
        { merge: true }
    )

    const result = await batch.commit().then(() => {
        return {
            status: 200,
            data: {
                mess: "Sent"
            }
        }
    }).catch((err) => {
        console.log(err)
        return {
            status: 404,
            data: {
                mess: "Can't send"
            }
        }
    })

    return result
}


// Merg Message
const mergeMessage_Model = async (req, res) => {
    const data = req.body.data
    const chatCode = data.chatCode
    const batch = db.batch()

    const newMessRef = db.collection("newMessage")
    const newMessDoc = await newMessRef.doc(btoa(chatCode)).get()
    let getAllNewMessages = []

    if (!newMessDoc.exists) {
        return {
            status: 200,
            data: {
                mess: "Don't merge"
            }
        }
    }

    if (newMessDoc.exists) {
        if (newMessDoc.data().messages.length != 0) getAllNewMessages = newMessDoc.data().messages
    }

    if (getAllNewMessages.length != 0) {
        const chatRef = db.collection("chat").doc(btoa(chatCode))
        batch.update(chatRef, { // Add message
            messages: FieldValue.arrayUnion(...getAllNewMessages)
        },
            { merge: true }
        )
    }

    batch.update(db.collection("newMessage").doc(btoa(chatCode)), {
        messages: [],
    },
        { merge: true }
    )

    const result = await batch.commit().then(() => {
        return {
            status: 200,
            data: {
                mess: "Sent"
            }
        }
    }).catch((err) => {
        console.log(err)
        return {
            status: 404,
            data: {
                mess: "Can't send"
            }
        }
    })

    return result
}

// Remove chat model
const removeChat_Model = async (req, res) => {
    const data = req.body.data
    const requirementType = data.type
    const chatCode = data.chatCode
    const requester_client = data.requester
    const targetGmail = data.targetGmail

    const batch = db.batch()

    if (requirementType == "revoke") {
        batch.update(db.collection("chat").doc(btoa(chatCode)), {
            requestRemove: FieldValue.delete()
        })

        let result = batch.commit().then(() => {
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

        return result

    } else if (requirementType == "remove") {
        // Check if there is a request
        const requestDoc = await db.collection("chat").doc(btoa(chatCode)).get()

        if (requestDoc.exists) {
            const getRequester = requestDoc.data().requestRemove

            // If have request to remove chat. Let remove it
            if (getRequester) {
                batch.delete(db.collection("chat").doc(btoa(chatCode)))
                batch.delete(db.collection("newMessage").doc(btoa(chatCode)))
                batch.update(db.collection("userInformation").doc(btoa(requester_client)), {
                    [`lastMessages.${chatCode}`]: FieldValue.delete(),
                    "listChatCode": FieldValue.arrayRemove(chatCode)
                })
                batch.update(db.collection("userInformation").doc(btoa(targetGmail)), {
                    [`lastMessages.${chatCode}`]: FieldValue.delete(),
                    "listChatCode": FieldValue.arrayRemove(chatCode)
                })

                let result = batch.commit().then(() => {
                    return {
                        status: 200,
                        data: {
                            mess: "Removed chat"
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
                batch.update(db.collection("chat").doc(btoa(chatCode)), {
                    requestRemove: requester_client
                })

                let result = batch.commit().then(() => {
                    return {
                        status: 200,
                        data: {
                            mess: "Sent requirement"
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                    return {
                        status: 404,
                        data: {
                            mess: "Can't require"
                        }
                    }
                })

                return result
            }
        } else {
            return {
                status: 404,
                data: {
                    mess: "No have chat"
                }
            }
        }
    }

    return {
        status: 404,
        data: {
            mess: "Can't process"
        }
    }
}

const data = {
    data: {
        chatCode: "string",
        sender: "string",
        content: "string",
        targetGmail: "string"
    }
}

module.exports = { sendMessage_Model, mergeMessage_Model, removeChat_Model }