const twilio = require("twilio");
const twilioConfig = require("../../config/twilioConfig");
const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

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
      to: `+91${phoneNumber}`,
    })
    .then((message) => {
      const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;

      pool.query(query, async (error, result) => {
        if (error) {
          return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        } else {
          const finalData = result?.rows?.map((res) => {
            delete res?.password;
            delete res?.updated_at;
            delete res?.is_kyc_verified;
          });

          delete result.rows[0].password;
          delete result.rows[0].updated_at;
          delete result.rows[0].is_kyc_verified;

          res.status(200).json({
            success: true,
            message: "OTP sent successfully!",
            sid: message.sid,
            data: result.rows[0],
          });
        }
      });
    })
    .catch((error) => {
      console.log("error while sending otp", error);
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
        to: `+91${phoneNumber}`,
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
