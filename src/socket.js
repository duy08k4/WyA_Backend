// Import
const { FieldValue } = require("firebase-admin/firestore")
const db = require("./config/firebaseSDK")

// Socket
const users_GmailKey = {} // { btoa(gmail): socketId, btoa(gmail): socketId } => Use for send location to client's friends.
const users_SocketidKey = {} // { socketId: gmail, socketId: gmail } => Use for update "offline" status's client to all Friend when client disconnect (close app).
const userFriends = {} // { btoa(gmail): [{}, {}, {}] } => Use for update "offline" status's client to all Friend too.

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Announce active status to client's friends when client connected
        socket.on("connected", (data) => {
            const clientGmail = data.gmail
            const clientListFriend = data.listFriends
            const clientListFriend_gmail = clientListFriend.map(friend => friend.gmail)

            users_GmailKey[btoa(clientGmail)] = socket.id
            users_SocketidKey[socket.id] = clientGmail
            userFriends[btoa(clientGmail)] = clientListFriend_gmail

            const batch = db.batch()

            // Announe active status to client's friends
            if (clientListFriend_gmail.length) {
                clientListFriend_gmail.forEach(friendGmail => {
                    batch.set(db.collection("userActiveStatus").doc(btoa(friendGmail)), {
                        [btoa(clientGmail)]: true
                    }, { merge: true })
                });

                batch.commit().then(() => {
                    console.log("==> SUCCESS::Client's status was updated to client's friends (Online). Action: Connect")
                }).catch((err) => {
                    console.log(err)
                })
            }

        })

        // Set "false" (offline) for user who do logout action
        socket.on("userLogout", (gmail) => {
            const clientGmail = gmail
            const clientListFriend_gmail = userFriends[btoa(clientGmail)]
            const batch = db.batch()

            if (clientListFriend_gmail && clientListFriend_gmail.length) {
                clientListFriend_gmail.forEach(friendGmail => {
                    batch.set(db.collection("userActiveStatus").doc(btoa(friendGmail)), {
                        [btoa(clientGmail)]: false
                    }, { merge: true })
                });

                batch.commit().then(() => {
                    delete userFriends[btoa(clientGmail)]  
                    console.log("==> SUCCESS::Client's status was updated to client's friends (Offline). Action: Logout")
                }).catch((err) => {
                    console.log(err)
                })
            }

        })

        // Disconnect
        socket.on('disconnect', () => {
            const clientGmail = users_SocketidKey[socket.id]
            const clientListFriend_gmail = userFriends[btoa(clientGmail)]
            const batch = db.batch()

            if (clientListFriend_gmail && clientListFriend_gmail.length) {
                clientListFriend_gmail.forEach(friendGmail => {
                    batch.set(db.collection("userActiveStatus").doc(btoa(friendGmail)), {
                        [btoa(clientGmail)]: false
                    }, { merge: true })
                });

                batch.commit().then(() => {
                    console.log("==> SUCCESS::Client's status was updated to client's friends (Offline). Action: Disconnect")
                }).catch((err) => {
                    console.log(err)
                })
            }
            
            delete userFriends[btoa(clientGmail)]  
        });
    });

    // console.log(userStatus_monitor)
};