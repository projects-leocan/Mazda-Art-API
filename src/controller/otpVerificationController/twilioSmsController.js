const twilio = require("twilio");
const twilioConfig = require("../../config/twilioConfig");
const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioServiceId = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

exports.sendOtpController = async (req, res) => {
  const { phoneNumber } = req.body;

  // First, check if the artist exists in the database
  const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;

  pool.query(query, async (error, result) => {
    if (error) {
      // console.log("error", error);
      return res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    } else {
      if (result.rows.length === 0) {
        return res.status(404).send({
          success: false,
          message: "NO ARTIST FOUND WITH THIS NUMBER",
          statusCode: 404,
        });
      } else {
        // Artist found, now send the OTP
        client.verify.v2
          .services(twilioServiceId)
          .verifications.create({
            to: `+91${phoneNumber}`,
            channel: "sms",
          })
          .then((message) => {
            // Remove sensitive data before sending the response
            delete result.rows[0].password;
            delete result.rows[0].updated_at;
            delete result.rows[0].is_kyc_verified;

            res.status(200).json({
              success: true,
              message: "OTP sent successfully!",
              data: result.rows[0],
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
      }
    }
  });
};

exports.verifyOtpController = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  try {
    // Check if the artist exists in the database
    const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;
    pool.query(query, async (error, result) => {
      if (error) {
        // console.log("verify error", error);
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (result.rows.length === 0) {
          return res.status(404).send({
            success: false,
            message: "No artist found with this number.",
            statusCode: 404,
          });
        }

        // Use Twilio's verification service to check the OTP
        const verifiedResponse = await client.verify.v2
          .services(twilioServiceId)
          .verificationChecks.create({
            to: `+91${phoneNumber}`,
            code: otp,
          });
        if (verifiedResponse.status === "approved") {
          // OTP is verified successfully
          delete result.rows[0].password;
          delete result.rows[0].updated_at;
          delete result.rows[0].is_kyc_verified;

          res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            data: result.rows[0],
          });
        } else {
          // OTP verification failed
          res.status(401).json({
            success: false,
            message: "Invalid OTP. Please try again.",
          });
        }

        // For Testing

        // if (otp === "123456") {
        //   delete result?.rows[0]?.password;
        //   delete result?.rows[0]?.updated_at;
        //   delete result?.rows[0]?.is_kyc_verified;
        //   res.status(200).json({
        //     success: true,
        //     message: "OTP Verified Successfully!",
        //     // sid: message.sid,
        //     data: result?.rows[0],
        //     message: "OTP verified successfully!",
        //     data: result.rows[0],
        //   });
        // }
        // else {
        //   res.status(500).json({
        //     success: false,
        //     // OTP verification failed

        //     message: "Invalid OTP. Please try again.",
        //     // sid: message.sid,
        //     data: result?.rows[0],
        //   });
        // }
      }
    });
  } catch (error) {
    // console.log("Error", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while verifying the OTP.",
      statusCode: 500,
    });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
