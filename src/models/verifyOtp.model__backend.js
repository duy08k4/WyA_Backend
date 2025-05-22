const verifyOtp__backend_Model = (req, res, verifyCode) => {
    const getOtp = req.cookies.otp
    const getInputOtp = verifyCode

    if (getInputOtp == getOtp) {
        res.clearCookie("otp")
        return {
            status: 200,
            data: {
                mess: "Verified"
            }
        }
    }

    return {
        status: 400,
        data: {
            mess: "OTP code is incorrect"
        }
    }
}

module.exports = verifyOtp__backend_Model