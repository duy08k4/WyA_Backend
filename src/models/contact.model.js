// Import database
const db = require("../config/firebaseSDK")

function createdTime() {
    const time = new Date()
    const minute = time.getMinutes()
    const date = time.getDate().toString()
    const month = time.getMonth().toString()
    const year = time.getFullYear().toString()
    const hour = time.getHours().toString()

    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute} - ${date} THG ${month}, ${year}`
}

function generateCode() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return `${(timestamp + random).toString()}`;
}

// ForgotPassword Send OTP
const contact_Model = async (req, res) => {
    const data = req.body.data

    if (data) {
        const clientGmail = data.gmail
        const topic = data.topic
        const content = data.content

        if (clientGmail && topic && content) {
            const batch = db.batch()
            const problemCode = generateCode()

            batch.set(db.collection("contact").doc(btoa(clientGmail)), {
                problemCode: {
                    topic,
                    content,
                    createdTime: createdTime()
                }
            }, { merge: true })

            batch.commit().then(() => {
                return res.json({
                    status: 200,
                    data: {
                        mess: "Sent"
                    }
                })
            }).catch((err) => {
                console.log(`ERROR<contact>: ${err}`)
                return res.json({
                    status: 404,
                    data: {
                        mess: "Cant's send"
                    }
                })
            })
        } else {
            return res.json({
                status: 404,
                data: {
                    mess: "Cant's send"
                }
            })
        }
    } else {
        return res.json({
            status: 404,
            data: {
                mess: "Cant's send"
            }
        })
    }

}

module.exports = contact_Model