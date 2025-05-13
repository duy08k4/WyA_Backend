// Import libraries
const db = require("../config/firebaseSDK");
const hs256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const ms = require("ms")

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
      expiresIn: process.env.LIFE_TIME_ACC_TOKEN,
    });

    // Create refreshToken
    const rfToken = jwt.sign({ gmail: gmail, userID: uuid }, process.env.SCKEY, {
      expiresIn: process.env.LIFE_TIME_REF_TOKEN,
    });

    // Set cookie
    res.cookie(process.env.ACCTOKEN_COOKIE_NAME, acToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: 'None',
      maxAge: ms(process.env.LIFE_TIME_REF_TOKEN)
    });

    res.cookie(process.env.REFTOKEN_COOKIE_NAME, rfToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: 'None',
      maxAge: ms(process.env.LIFE_TIME_REF_TOKEN)
    });

    return {
      status: 200,
      data: {
        mess: "Log in successfully",
        user: {
          gmail
        }
      },
    }
  }
};

module.exports = loginAccount_Model
