const verifyOtp_Model = (req, res) => {
    const getOtp = req.cookies.otp
    const data = req.body.data
    const getInputOtp = data.inputOtp

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

module.exports = verifyOtp_Model