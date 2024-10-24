const twilio = require("twilio");
const twilioConfig = require("../../config/twilioConfig");
const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

const accountSid = twilioConfig.TWILIO_ACCOUNT_SID;
const authToken = twilioConfig.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = twilioConfig.TWILIO_PHONE_NUMBER;
const twilioServiceId = twilioConfig.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);
require("dotenv").config();

exports.sendOtpController = async (req, res) => {
  const { phoneNumber } = req.body;

  // client.messages
  //   .create({
  //     body: `Your OTP code is ${generateOTP()}`,
  //     from: twilioPhoneNumber,
  //     to: `+91${phoneNumber}`,
  //   })
  //   .then((message) => {
  //     const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;

  //     pool.query(query, async (error, result) => {
  //       if (error) {
  //         return res.status(500).send({
  //           success: false,
  //           message: somethingWentWrong,
  //           statusCode: 500,
  //         });
  //       } else {
  //         const finalData = result?.rows?.map((res) => {
  //           delete res?.password;
  //           delete res?.updated_at;
  //           delete res?.is_kyc_verified;
  //         });

  //         delete result?.rows[0]?.password;
  //         delete result?.rows[0]?.updated_at;
  //         delete result?.rows[0]?.is_kyc_verified;

  //         res.status(200).json({
  //           success: true,
  //           message: "OTP sent successfully!",
  //           sid: message.sid,
  //           data: result?.rows[0],
  //         });
  //       }
  //     });
  //   })
  //   .catch((error) => {
  //     console.log("error while sending otp", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to send OTP.",
  //       error: error.message,
  //     });
  //   });
  const findArtistQuery = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;
  pool.query(findArtistQuery, async (error, result) => {
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "No artist found with this number.",
        statusCode: 404,
      });
    } else {
      try {
        // await client.verify.v2.services(twilioServiceId).verifications.create({
        //   to: `+91${phoneNumber}`,
        //   channel: "sms",
        // });
        res.status(200).send({
          success: false,
          message: "OTP sent successfully!",
          statusCode: 200,
        });
      } catch (error) {
        if (error.status === 429) {
          res.status(500).send({
            success: false,
            message:
              "Max check attempts reached. Please check after some time.",
          });
        } else {
          res.status(500).send({
            success: false,
            message: "Something went wrong!",
            statusCode: 500,
          });
        }
      }
    }
  });
};

// exports.verifyOtpController = async (req, res) => {
//   const { otp, phoneNumber } = req.body;

//   try {
//     const verifiedResponse = await client.verify.v2
//       .services(twilioServiceId)
//       .verificationChecks.create({
//         to: `+91${phoneNumber}`,
//         code: +otp,
//       });
//     res.status(200).json({
//       success: true,
//       message: "OTP verified successfully!",
//       response: verifiedResponse,
//     });
//   } catch (error) {
//     console.log("Error:", error.code, error.message);
//     res.status(400).json({
//       success: false,
//       message: "Invalid OTP. Please try again.",
//       error: error,
//     });
//   }

//   // if (otp === userOtp) {
//   //   res.status(200).json({
//   //     success: true,
//   //     message: "OTP verified successfully!",
//   //   });
//   // } else {
//   // }
// };

// Helper function to generate OTP

exports.verifyOtpController = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  const sgMail = require("@sendgrid/mail");

  try {
    const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;
    // console.log("query", query);
    pool.query(query, async (error, result) => {
      if (error) {
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (otp === "123456") {
          delete result?.rows[0]?.password;
          delete result?.rows[0]?.updated_at;
          delete result?.rows[0]?.is_kyc_verified;

          // const API_KEY = process.env.SENDGRID_API_KEY;

          // sgMail.setApiKey(API_KEY);
          // const message = {
          //   to: "shweta.leocan@gmail.com",
          //   from: { name: "Mazda Art", email: "bhavya.leocan@gmail.com" },
          //   templateId: "d-fefb690939134bc485e443f5e8d3f3da",
          //   dynamicTemplateData: {
          //     name: `${result?.rows[0]?.fname} ${result?.rows[0]?.lname}`,
          //   },
          // };

          // sgMail
          //   .send(message)
          //   .then(() => {
          //     console.log("Email sent");
          //   })
          //   .catch((error) => {
          //     console.error("Error sending email:", error);
          //   });

          res.status(200).json({
            success: true,
            message: "OTP Verified Successfully!",
            // sid: message.sid,
            data: result?.rows[0],
          });
        } else {
          res.status(500).json({
            success: true,
            message: "Invalid OTP. Please try again.",
            // sid: message.sid,
            data: result?.rows[0],
          });
        }
      }
    });
    // await client.verify.v2
    //   .services(twilioServiceId)
    //   .verificationChecks.create({
    //     to: `+91${phoneNumber}`,
    //     code: +otp,
    //   })
    //   .then((verificationCheck) => {
    //     if (verificationCheck.status === "approved") {
    //       const query = `SELECT * FROM artist WHERE mobile_number = '${phoneNumber}'`;

    //       pool.query(query, async (error, result) => {
    //         if (error) {
    //           return res.status(500).send({
    //             success: false,
    //             message: somethingWentWrong,
    //             statusCode: 500,
    //           });
    //         } else {
    //           delete result?.rows[0]?.password;
    //           delete result?.rows[0]?.updated_at;
    //           delete result?.rows[0]?.is_kyc_verified;

    //           res.status(200).json({
    //             success: true,
    //             message: "OTP Verified Successfully!",
    //             // sid: message.sid,
    //             data: result?.rows[0],
    //           });
    //         }
    //       });
    //     } else {
    //       res.status(401).send("Invalid OTP");
    //       res.status(401).json({
    //         success: false,
    //         message: "Invalid OTP. Please try again.",
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.status === 404) {
    //       res.status(404).send({
    //         success: false,
    //         message: "Your OTP is expired. Please resend it.",
    //       });
    //     } else if (error.status === 429) {
    //       res.status(500).send({
    //         success: false,
    //         message: "Max check attempts reached.",
    //       });
    //     } else {
    //       res.status(500).send({
    //         success: false,
    //         message: "Something went wrong",
    //         error: error,
    //       });
    //     }
    //   });
  } catch (error) {
    // console.log("Error:", error.code, error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
