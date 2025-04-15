// Import libraries
const db = require("../config/firebaseSDK")
const hs256 = require("js-sha256")

// Model
const loginAccount_Model = async (inputData) => {
    const {gmail, passwordInput} = inputData
    const user = await db.collection("accounts").doc(btoa(gmail)).get()
    
    if (!user.exists) {
        return {
            status: 404,
            data: {
                mess: "Unsuccessful"
            }
        }
    }
    else {
       const password = user.data().password
       
       if (hs256(passwordInput) != password) {
        return {
            status: 404,
            data: {
                mess: "Unsuccessful"
            }
         }
       }
       
       // Return user data for JWT token creation
       return {
           status: 200,
           data: {
               mess: "Successful",
               user: {
                   gmail: gmail,
                   ...user.data()
               }
           }
       }
    }
}

module.exports = loginAccount_Model