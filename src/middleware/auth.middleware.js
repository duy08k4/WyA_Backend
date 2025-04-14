// JWT Authentication Middleware
const jwt = require('jsonwebtoken')
const { db } = require('../config/firebaseSDK')
const { base64URL } = require('../controllers/modules/base64URL')
require('dotenv').config()

// AUTHORIZE FOR LOGIN
const authorizeLogin = (req, res, next) => {
    let getAccessToken = req.cookies[base64URL(process.env.CK_acToken)] ? atob(req.cookies[base64URL(process.env.CK_acToken)]) : undefined
    let getRefreshToken = req.cookies[base64URL(process.env.CK_rfToken)] ? atob(req.cookies[base64URL(process.env.CK_rfToken)]) : undefined
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        // Token expired, user needs to login again
                    } else {
                        newAccessToken = jwt.sign({username: rfData.username, userID: rfData.userID}, process.env.SCKEY, { expiresIn: "15m" })
                        res.cookie(base64URL(process.env.CK_acToken), base64URL(newAccessToken), {
                            httpOnly: true,
                            secure: true
                        })

                        req.user = {
                            username: rfData.username,
                            userID: rfData.userID,
                            logined: true,
                            limitAmountLink: atob(req.cookies[base64URL(process.env.ammountLink)])
                        }
                    }
                })
            } else {
                req.user = {
                    username: decoded.username,
                    userID: decoded.userID,
                    logined: true,
                    limitAmountLink: atob(req.cookies[base64URL(process.env.ammountLink)])
                }
            }
        })
    }
    next()
}

// AUTHRIZE FOR FUNCTION
const authorize = (req, res, next) => {
    let getAccessToken = req.cookies[base64URL(process.env.CK_acToken)] ? atob(req.cookies[base64URL(process.env.CK_acToken)]) : undefined
    let getRefreshToken = req.cookies[base64URL(process.env.CK_rfToken)] ? atob(req.cookies[base64URL(process.env.CK_rfToken)]) : undefined
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        return res.json({
                            status: "E",
                            message: "Your session has expired. Please login again.",
                            redirect: "/login"
                        })
                    } else {
                        newAccessToken = jwt.sign({username: rfData.username, userID: rfData.userID}, process.env.SCKEY, { expiresIn: "20s" })
                        res.cookie(base64URL(process.env.CK_acToken), base64URL(newAccessToken), {
                            httpOnly: true,
                            secure: true
                        })

                        req.user = {
                            username: rfData.username,
                            userID: rfData.userID,
                        }

                        next()
                    }
                })
            } else {
                req.user = {
                    username: decoded.username,
                    userID: decoded.userID,
                }

                next()
            }
        })
        // If no access token or refresh token is found
    } else return res.json({
        status: "E",
        message: "Please login first.",
        redirect: "/login"
    })
}

// Refresh token middleware
const refreshToken = async (req, res) => {
    const getRefreshToken = req.cookies[base64URL(process.env.CK_rfToken)] ? atob(req.cookies[base64URL(process.env.CK_rfToken)]) : undefined
    
    if (!getRefreshToken) {
        return res.json({
            status: E,
            data: {
                mess: "Refresh token not found"
            }
        })
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(getRefreshToken, process.env.SCKEY)
        
        // Generate new access token
        const newAccessToken = jwt.sign(
            {username: decoded.username, userID: decoded.userID},
            process.env.SCKEY,
            { expiresIn: "15m" }
        )
        
        // Set new access token cookie
        res.cookie(base64URL(process.env.CK_acToken), base64URL(newAccessToken), {
            httpOnly: true,
            secure: true
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

module.exports = { authorizeLogin, authorize, refreshToken }
