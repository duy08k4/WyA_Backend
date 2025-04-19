const nodemailer = require("nodemailer")

// Checking existence's verifycode
const verifyCodeChecking = (req, res) => {
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
const sendOTP = async (data, res) => {
  const targetGmail = data.gmail
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
      <p style="font-size: 14px; color: #8f98a0; text-align: center;">This code will expire in <strong><u>1 minutes</u></strong>.</p>
      <hr style="border: none; border-top: 1px solid #2a475e; margin: 30px 0;">
      <p style="font-size: 12px; color: #8f98a0; text-align: center;">
        If you didn't request this, please ignore this email.<br>
      </p>
    </div>
  `;

  const result = await transporter.sendMail({
    from: emailSender,
    to: targetGmail,
    subject: "WYA - VERIFICATION",
    html: emailForm,
  }).then(() => {
    res.cookie("otp", OTP, {
      maxAge: 1 * 60 * 1000,
      httpOnly: true,
      secure: true,
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
const sendOtp_Model = async (req, res) => {
  const getMethodOTP = req.body.data.method

  switch (getMethodOTP) {
    case "send":
      const checking = verifyCodeChecking(req, res)
      if (checking.status == 429) {
        return checking
      }

      return sendOTP(req.body.data, res)
      
    case "resend":
      return sendOTP(req.body.data, res)

    default:
      return {
        status: 404,
        data: {
          mess: "(Dev) Error in SendOTP"
        }
      }
  }
}

module.exports = sendOtp_Model