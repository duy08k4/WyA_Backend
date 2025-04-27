const jwt = require("jsonwebtoken")
const db = require("../config/firebaseSDK")

const checkToken_Model = async (req, res) => {
    const getAccessToken = req.cookies[process.env.ACCTOKEN_COOKIE_NAME] ? req.cookies[process.env.ACCTOKEN_COOKIE_NAME] : undefined
    const getRefreshToken = req.cookies[process.env.REFTOKEN_COOKIE_NAME] ? req.cookies[process.env.REFTOKEN_COOKIE_NAME] : undefined

    if (getAccessToken && getRefreshToken) {
        //Verify token
        jwt.verify(getAccessToken, process.env.SCKEY, (accessToken_err, accessToken_decoded) => {
            if (accessToken_err) { //Access Token is expired => Let check refresh Token to create a new access token
                jwt.verify(getRefreshToken, process.env.SCKEY, (refreshToken_err, refreshToken_decoded) => {
                    if (!refreshToken_err) { // Refresh Token is valid => Create a new access token.
                        const newAccessToken = jwt.sign({ gmail: refreshToken_decoded.gmail, userID: refreshToken_decoded.userID }, process.env.SCKEY, {
                            expiresIn: process.env.LIFE_TIME_ACC_TOKEN,
                        })

                        res.cookie(process.env.ACCTOKEN_COOKIE_NAME, newAccessToken, {
                            httpOnly: true,
                            secure: true,
                        });

                        // Check Refresh Token lifetime
                        const now = Math.floor(Date.now() / 1000);
                        const expToken = refreshToken_decoded.exp
                        const leftLifeTime = expToken - now

                        if (leftLifeTime < (5 * 60)) { // If life time under 5 minute => Create new refresh Token
                            const newRefreshToken = jwt.sign({ gmail: refreshToken_decoded.gmail, userID: refreshToken_decoded.userID }, process.env.SCKEY, {
                                expiresIn: process.env.LIFE_TIME_REF_TOKEN,
                            });

                            res.cookie(process.env.REFTOKEN_COOKIE_NAME, newRefreshToken, {
                                httpOnly: true,
                                secure: true,
                            });
                        }

                        return res.json({
                            status: 200,
                            data: {
                                mess: "Allow access",
                                user: {
                                    gmail: refreshToken_decoded.gmail
                                }
                            }
                        })
                    } else {
                        return res.json({
                            status: 498,
                            data: {
                                mess: "Deny access"
                            }
                        })
                    }
                })
            } else {
                return res.json({
                    status: 200,
                    data: {
                        mess: "Allow access",
                        user: {
                            gmail: accessToken_decoded.gmail
                        }
                    }
                })
            }
        })

    } else {
        return res.json({
            status: 401,
            data: {
                mess: "Deny access"
            }
        })
    }
}

module.exports = checkToken_Model