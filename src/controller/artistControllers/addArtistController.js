const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
var nodemailer = require("nodemailer");

const { fileUpload } = require("../../utils/fileUpload");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
} = require("../../constants/filePaths");
var lodash = require("lodash");
const { getArtistDetails } = require("./getArtistDetail");
const { email, password } = require("../../constants/mailData");

exports.addArtistController = async (req, res) => {
  // console.log(`req.body: ${JSON.stringify()}`);
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      let {
        fname,
        lname,
        dob,
        gender,
        email,
        mobile_number,
        address1,
        address2,
        city,
        state,
        pincode,
        social_media_link,
        portfolio_file_ext,
        profile_pic_file_ext,
        is_portfolio_updated,
        is_profile_pic_updated,
      } = fields;

      // console.log(`controller: ${JSON.stringify(fields)}`);

      const portfolio_image = files["portfolio"];
      const profile_image = files["profile_pic"];

      const currentTime = new Date().toISOString().slice(0, 10);
      let profileImageUploadError = "",
        portfolioImageUploadError = "";


      const checkQuery = `SELECT * FROM artist WHERE mobile_number = '${mobile_number}'`;

      pool.query(checkQuery, async (checkErr, checkResult) => {
        if (checkErr) {
          // Handle error from check query
          return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        }
        if (checkResult.rows.length > 0) {
          // Contact number already exists
          return res.status(400).send({
            success: false,
            message: "Contact number already exists, try a different number.",
            statusCode: 400,
          });
        }

        let query = `INSERT INTO artist(fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_profile_link, artist_portfolio, profile_pic, created_at, updated_at) VALUES ('${fname}', '${lname}', '${dob}', '${gender}', '${email}', '${mobile_number}', '${
          address1 === undefined ? "null" : address1
        }', '${
          address2 === undefined ? "null" : address2
        }', '${city}', '${state}', ${pincode}, '${social_media_link}', 'null', 'null', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING artist_id`;

        pool.query(query, async (newErr, newResult) => {
          if (newErr) {
            if (newErr.detail === `Key (email)=(${email}) already exists.`) {
              res.status(500).send({
                success: false,
                message: `${email} is already exists.`,
                statusCode: 500,
                profileImageUploadError: profileImageUploadError,
                portfolioImageUploadError: portfolioImageUploadError,
              });
            } else {
              res.status(500).send({
                success: false,
                message: "Something went wrong",
                statusCode: 500,
                profileImageUploadError: profileImageUploadError,
                portfolioImageUploadError: portfolioImageUploadError,
              });
            }
          } else {
            const artist_id = newResult.rows[0]?.artist_id;
            // Send email after successful registration
            const subject = "Artist Registration Successful";
            const text = `Dear ${fname} ${lname},\n\nThank you for registering as an artist. Your registration is successful.\n\nBest regards,\nYour Team`;

            try {
              console.log(`Email sent to: ${email}`);
            } catch (emailErr) {
              console.log(`Error sending email: ${emailErr}`);
            }

            getArtistDetails(
              artist_id,
              "User Details Updated Successfully",
              res,
              req
            );
          }
        });
      });
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
