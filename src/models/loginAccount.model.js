// Import libraries
const db = require("../config/firebaseSDK");
const hs256 = require("js-sha256");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authorization");

// Model
const loginAccount_Model = async (req, res) => {
  const data = req.body.data
    const gmail = data.gmail
    const passwordInput = data.passwordInput
  const user = await db.collection("accounts").doc(btoa(gmail)).get();

  if (!user.exists) {
    return res.json({
      status: 404,
      data: {
        mess: "Failed to login",
      },
    })
  } else {
    const password = user.data().password;

    if (password !== hs256(passwordInput)) {
      return res.json({
        status: 404,
        data: {
          mess: "Failed to login",
        },
      })
    }

    const uuid = user.data().uuid;
    const acToken = jwt.sign({ gmail: gmail, userID: uuid }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const rfToken = jwt.sign({ gmail: gmail, userID: uuid }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("acToken", acToken, {
      httpOnly: true,
      secure: true,
    });

    res.cookie("rfToken", rfToken, {
      httpOnly: true,
      secure: true,
    });

    return res.json({
      status: 200,
      data: {
        mess: "Successful",
      },
    })
  }
};

module.exports = loginAccount_Model
