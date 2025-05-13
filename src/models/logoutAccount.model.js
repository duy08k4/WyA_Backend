const logoutAccount_Model = (req, res) => {
    res.clearCookie(process.env.ACCTOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: 'None'
    });

    res.clearCookie(process.env.REFTOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: 'None'
    });

    return {
        status: 200,
        data: {
            mess: "Signed out"
        }
    }
}

module.exports = logoutAccount_Model