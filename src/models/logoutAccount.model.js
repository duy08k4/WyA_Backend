const logoutAccount_Model = (req, res) => {
    res.clearCookie(process.env.ACCTOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.clearCookie(process.env.REfTOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
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