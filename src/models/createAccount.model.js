// Import libraries
const { v4 } = require("uuid")

// Import database
const db = require("../config/firebaseSDK")
const hs256 = require("js-sha256")

// Support func
function createdTime () {
    const time = new Date()
    const minute = time.getMinutes()
    const date = time.getDate().toString()
    const month = time.getMonth().toString()
    const year = time.getFullYear().toString()
    const hour = time.getHours().toString()

    return `${hour}:${minute < 10 ? `0${minute}` : minute} - ${date} THG ${month}, ${year}`
}

// Model
const createAccount_Model = async (req, res) => {
    const data = req.body.data
    const username = data.username
    const gmail = data.gmail
    const password = data.password
    const uuid = "u-wya:" + v4()

    const batch = db.batch() // Use to merge requests

    const ref_createAccount = db.collection("accounts").doc(btoa(gmail))
    batch.set(ref_createAccount,{
        username: username,
        gmail: gmail,
        password: hs256(password),
        uuid,
        activate: false,
        createdTime: createdTime(),
    })

    const ref_verifyAccount = db.collection("verifications").doc(btoa(gmail))
    batch.set(ref_verifyAccount, {
        code: (Math.floor(Math.random() * 8999) + 1000).toString()
    })

    const result = await batch.commit().then(() => {
        return {
            status: 200,
            data: {
                mess: "Registered successfully"
            }
        }
    }).catch(() => {
        return {
            status: 404,
            data: {
                mess: "Registration failed"
            }
        }
    })

    return result
}

module.exports = createAccount_Model