const nodemailer = require("nodemailer")

// Checking existence's verifycode
const verifyCodeChecking = (req) => {
  const getOTP = req.cookies.otp

  if (getOTP) {
    return {
      status: 429,
      data: {
        mess: "OTP has been sent"
      }
    }
  } else return false
}

// Send OTP function
const sendOTP = async(gmail, res, expireTime, title) => {
  const targetGmail = gmail
  const emailSender = "nluecar240@gmail.com";
  const password = process.env.GMAIL_PASSCODE;

  // Tạo transporter với cấu hình SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailSender,
      pass: password,
    },
  });

  const OTP = (Math.floor(Math.random() * 8999) + 1000).toString()
  const emailForm = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #1b2838; color: #c7d5e0; padding: 40px; max-width: 500px; margin: auto; border-radius: 10px;">
      <h2 style="color: #66c0f4; text-align: center;">WYA - Where Ya At</h2>
      <p style="font-size: 16px; text-align: center;">Your One-Time Password (OTP) is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 32px; letter-spacing: 6px; font-weight: bold; background-color: #171a21; padding: 10px 20px; border-radius: 8px; color: #ffffff; border: 1px solid #66c0f4;">
          ${OTP}
        </span>
      </div>
      <p style="font-size: 14px; color: #8f98a0; text-align: center;">This code will expire in <strong><u>${expireTime} minutes</u></strong>.</p>
      <hr style="border: none; border-top: 1px solid #2a475e; margin: 30px 0;">
      <p style="font-size: 12px; color: #8f98a0; text-align: center;">
        If you didn't request this, please ignore this email.<br>
      </p>
    </div>
  `;

  const result = await transporter.sendMail({
    from: emailSender,
    to: targetGmail,
    subject: `WYA - VERIFICATION - ${title}`,
    html: emailForm,
  }).then(() => {
    res.cookie("otp", OTP, {
      maxAge: expireTime * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });

    return {
      status: 200,
      data: {
        mess: "OTP sent"
      }
    }
  })
    .catch((err) => {
      console.log(err)
      return {
        status: 404,
        data: {
          mess: "Failed to send"
        }
      }
    })

  return result
}

// Send verify code
const sendOtp__backend = async(req, res, gmail, expireTime, title) => {
  const checking = verifyCodeChecking(req)
  const OTP_expireTime = expireTime && expireTime > 1 ? parseInt(expireTime) : 1
  const OTP_title = title ? title : ""
  if (checking.status == 429) {
    return checking
  }

  return sendOTP(gmail, res, OTP_expireTime, OTP_title)
}

module.exports = sendOtp__backend