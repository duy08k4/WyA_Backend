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
const createAccount_Model = async (inputData) => {
    const { username, gmail, password } = inputData
    const uuid = "u-wya:" + v4()
    const result = await db.collection("accounts").doc(btoa(gmail)).set({
        username: username,
        gmail: gmail,
        password: hs256(password),
        uuid,
        createdTime: createdTime(),
    }).then(() => {
        return {
            status: 200,
            data: {
                mess: "Successfull"
            }
        }
    }).catch(() => {
        return {
            status: 404,
            data: {
                mess: "Unsuccessfull"
            }
        }
    })

    return result
}

module.exports = createAccount_Model