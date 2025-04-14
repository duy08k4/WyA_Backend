// JWT Authentication Middleware
const jwt = require('jsonwebtoken')
const { db } = require('../config/firebaseSDK')
require('dotenv').config()

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    // Get token from cookies or authorization header
    const accessToken = req.cookies.accessToken || 
                       (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!accessToken) {
        return res.json({
            status: E,
            data: {
                mess: "Access denied. No token provided."
            }
        })
    }

    try {
        // Verify token
        const decoded = jwt.verify(accessToken, process.env.SCKEY)
        req.user = decoded;
        next()
    } catch (error) {
        return res.json({
            status: E,
            data: {
                mess: "Invalid token."
            }
        })
    }
}

// Refresh token middleware
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
        return res.json({
            status: E,
            data: {
                mess: "Refresh token not found"
            }
        })
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.SCKEY)
        
        // Find user in database
        const userEmail = decoded.email
        const querySnapshot = await db.collection("accounts").get()
        
        let foundUser = null
        let docId = null
        
        querySnapshot.forEach((doc) => {
            const userData = doc.data()
            if (userData.gmail === userEmail) {
                foundUser = userData
                docId = doc.id
            }
        })
        
        if (!foundUser) {
            return res.json({
                status: E,
                data: {
                    mess: "User not found"
                }
            })
        }
        
        // Generate new access token
        const userID = foundUser.uuid || docId
        const accessToken = jwt.sign(
            { email: userEmail, uuid: userID },
            process.env.SCKEY,
            { expiresIn: "15m" }
        );
        
        // Set new access token cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: "15m"
        })
        
        return res.json({
            status: S,
            data: {
                mess: "Token refreshed successfully"
            }
        })
    } catch (error) {
        return res.json({
            status: E,
            data: {
                mess: "Invalid refresh token"
            }
        })
    }
}

module.exports = { verifyToken, refreshToken }
