const pool = require("../../config/db");
const twilio = require("twilio");
const twilioConfig = require("../../config/twilioConfig");
const { somethingWentWrong } = require("../../constants/messages");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioServiceId = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);
require("dotenv").config();

exports.sendOtp = async (mobileNumber, res, req, use) => {
  if (!mobileNumber) {
    throw new Error("Phone number is required.");
  }

  const query = `SELECT * FROM artist WHERE mobile_number = '${mobileNumber}'`;
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
            to: `+91${mobileNumber}`,
            channel: "sms",
          })
          .then((message) => {
            // Remove sensitive data before sending the response
            delete result.rows[0].password;
            delete result.rows[0].updated_at;
            delete result.rows[0].is_kyc_verified;

            res.status(200).json({
              success: true,
              message:
                use === "registration"
                  ? "Artist added successfully"
                  : "OTP sent successfully!",
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
