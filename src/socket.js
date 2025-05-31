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

        // Share location
        socket.on('shareLocation', (data) => {
            const clientGmail = data.clientGmail
            const clientLocation = data.clientLocation
            const targetUsersGmail = data.targetUsersGmail // Array type

            targetUsersGmail.forEach(userGmail => {
                const socketId = users_GmailKey[btoa(userGmail)];
                if (socketId) {
                    io.to(socketId).emit("receiveLocation", {
                        from: clientGmail,
                        location: clientLocation
                    });
                }
            });
        })

        // Disconnect
        socket.on('disconnect', () => {
            const clientGmail = users_SocketidKey[socket.id]
            const clientListFriend_gmail = userFriends[btoa(clientGmail)]
            const currentSocketId = socket.id

            // Thoát là coi như off
            const stillOnline = Object.entries(users_SocketidKey).some(([sid, gmail]) =>
                gmail === clientGmail && sid !== currentSocketId
            )

            if (!stillOnline && clientListFriend_gmail?.length) {
                const batch = db.batch()

                clientListFriend_gmail.forEach(friendGmail => {
                    batch.set(db.collection("userActiveStatus").doc(btoa(friendGmail)), {
                        [btoa(clientGmail)]: false
                    }, { merge: true })
                })

                batch.commit().then(() => {
                    console.log("🔴 User auto disconnected (not reconnected). Status set to OFFLINE.")
                }).catch(console.error)
            }

            // Xóa cache
            delete userFriends[btoa(clientGmail)]
            delete users_GmailKey[btoa(clientGmail)]
            delete users_SocketidKey[currentSocketId]
            // setTimeout(() => {
            // }, 3000)
        })
    });
};