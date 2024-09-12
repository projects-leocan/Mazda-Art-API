const twilio = require("twilio");
const twilioConfig = require("../../config/twilioConfig");

const accountSid = twilioConfig.TWILIO_ACCOUNT_SID;
const authToken = twilioConfig.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = twilioConfig.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendOtpController = async (req, res) => {
  const { phoneNumber } = req.body;

  client.messages
    .create({
      body: `Your OTP code is ${generateOTP()}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })
    .then((message) => {
      res.status(200).json({
        success: true,
        message: "OTP sent successfully!",
        sid: message.sid,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP.",
        error: error.message,
      });
    });
};

exports.verifyOtpController = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  try {
    const verifiedResponse = await client.verify.v2
      .services(accountSid)
      .verificationChecks.create({
        code: otp,
        to: `${phoneNumber}`,
      });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully!",
      response: verifiedResponse,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      success: false,
      message: "Invalid OTP. Please try again.",
      error: error,
    });
  }
  // if (otp === userOtp) {
  //   res.status(200).json({
  //     success: true,
  //     message: "OTP verified successfully!",
  //   });
  // } else {
  // }
};

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
