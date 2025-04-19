// Import libraries
const db = require("../config/firebaseSDK");
const hs256 = require("js-sha256");
const jwt = require("jsonwebtoken");

// Model
const loginAccount_Model = async (req, res) => {
  const data = req.body.data
  const gmail = data.gmail
  const passwordInput = data.passwordInput
  const user = await db.collection("accounts").doc(btoa(gmail)).get();

  if (!user.exists) {
    return {
      status: 404,
      data: {
        mess: "Failed to login",
      },
    }
  } else {
    const password = user.data().password;

    if (password !== hs256(passwordInput)) {
      return {
        status: 404,
        data: {
          mess: "Failed to login",
        },
      }
    }

    const uuid = user.data().uuid;

    // Create accessToken
    const acToken = jwt.sign({ gmail: gmail, userID: uuid }, process.env.SCKEY, {
      expiresIn: "15m",
    });

    // Create refreshToken
    const rfToken = jwt.sign({ gmail: gmail, userID: uuid }, process.env.SCKEY, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("acToken", acToken, {
      httpOnly: true,
      secure: true,
    });

    res.cookie("rfToken", rfToken, {
      httpOnly: true,
      secure: true,
    });

    return {
      status: 200,
      data: {
        mess: "Log in successfully",
      },
    }
  }
};

module.exports = loginAccount_Model
