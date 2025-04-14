// Import database
const db = require("../config/firebaseSDK")
const hs256 = require("js-sha256")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Model
const loginAccount_Model = async (inputData) => {
    // Check for required fields
    if (!inputData || !inputData.username || !inputData.gmail || !inputData.password) {
        console.log('Missing required fields:', inputData)
        return {
            status: E,
            data: {
                mess: "Missing required fields"
            }
        }
    }

    const { username, gmail, password } = inputData
    // Search for user by username
    console.log('Searching for user:', username)
    
    try {
        const querySnapshot = await db.collection("accounts").get()
        
        // Check documents for user
        let foundUser = null
        let docId = null
        
        querySnapshot.forEach((doc) => {
            const userData = doc.data()
            if (userData.username === username) {
                foundUser = userData
                docId = doc.id
            }
        })
        
        if (!foundUser) {
            console.log('User not found:', username)
            return {
                status: E,
                data: {
                    mess: "Invalid credentials"
                }
            }
        }
        
        // Check password
        if (foundUser.password === hs256(password)) {
            console.log('Password correct')
            
            // Generate JWT tokens
            const userID = foundUser.uuid || docId
            const userRole = foundUser.role || "user"
            let refreshToken
            
            // Check if refresh token exists and is valid
            if (!foundUser.rfToken) {
                refreshToken = jwt.sign(
                    { username, userID }, 
                    process.env.SCKEY, 
                    { expiresIn: "15m" }
                )
                
                // Update user document with refresh token
                await db.collection("accounts").doc(docId).update({
                    rfToken: btoa(refreshToken)
                })
            } else {
                try {
                    // Verify existing refresh token
                    jwt.verify(
                        atob(foundUser.rfToken), 
                        process.env.SCKEY
                    )
                    refreshToken = foundUser.rfToken
                } catch (err) {
                    // Generate new refresh token if expired
                    refreshToken = jwt.sign(
                        { username, userID }, 
                        process.env.SCKEY, 
                        { expiresIn: "15m" }
                    )
                    
                    // Update user document with new refresh token
                    await db.collection("accounts").doc(docId).update({
                        rfToken: btoa(refreshToken)
                    })
                }
            }
            
            // Generate access token
            const accessToken = jwt.sign(
                { username, userID }, 
                process.env.SCKEY, 
                { expiresIn: "15m" }
            )
            
            // Get user role and permissions
            // let getLimit = await db.collection("rules").doc("limitation").get()
            // let getRole = await db.collection("roles").doc(userRole).get()
            // let limitAmountLink = getRole.data().amountLink
            
            return {
                status: S,
                data: {
                    mess: "Successful",
                    acToken: accessToken,
                    rfToken: refreshToken,
                    userRole: userRole
                }
            }
        } else {
            console.log('Password incorrect')
            return {
                status: "E",
                data: {
                    mess: "Invalid passwords"
                }
            }
        }
    } catch {
        return {
            status: 404,
            data: {
                mess: "Unsuccessful"
            }
        }
    }
}

module.exports = loginAccount_Model

// example for postman
// {
//     "data": {
//       "username": "testuser",
//       "gmail": "testuser@gmail.com",
//       "password": "password123"
//     }
//   }
