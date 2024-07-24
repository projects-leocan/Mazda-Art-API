const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
var fs = require("fs");
var path = require("path");
const { fileUpload } = require("../../utils/fileUpload");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
} = require("../../constants/filePaths");
var lodash = require("lodash");
const { getArtistDetails } = require("./getArtistDetail");
const { passwordHashing } = require("../../constants/passwordHashing");

exports.updateArtistController = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    // console.log('form data: ', form);
    form.parse(req, async function (err, fields, files) {
      const {
        artist_id,
        password,
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
        social_media_profile_link,
        portfolio_file_ext,
        profile_pic_file_ext,
        is_profile_pic_updated,
        is_portfolio_updated,
        is_moc_update,
        mocs,
        is_kyc_verified,
      } = fields;

      for (let key in fields) {
        if (Array.isArray(fields[key]) && fields[key].length === 1) {
          fields[key] = fields[key][0];
        }
      }

      let query = `UPDATE artist set `;
      if (Object.keys(fields).length === 0) {
        res.status(500).send({
          success: false,
          message: "Pass data in body",
          statusCode: 500,
        });
      }
      if (artist_id != undefined && artist_id === "") {
        res.status(500).send({
          success: false,
          message: "artist_id can not be  empty.",
          statusCode: 500,
        });
      }
      const portfolio_image = files["portfolio"];
      const profile_image = files["profile_pic"];

      let profileImageUploadError, portfolioImageUploadError;

      const currentTime = new Date().toISOString().slice(0, 10);
      query += `updated_at='${currentTime}'`;
      if (fname !== undefined) {
        query += `, fname='${fname}'`;
      }
      if (lname !== undefined) {
        query += `, lname='${lname}'`;
      }
      if (dob !== undefined) {
        query += `, dob='${dob}'`;
      }
      if (password !== undefined) {
        const hashedPassword = await passwordHashing(`${password}`);
        query += `, password='${hashedPassword}'`;
      }
      if (gender !== undefined) {
        query += `, gender='${gender}'`;
      }
      if (email !== undefined) {
        query += `, email='${email}'`;
      }
      if (mobile_number !== undefined) {
        const mobile = JSON.parse(mobile_number);

        const checkQuery = `SELECT * FROM artist WHERE mobile_number = $1`;
        const values = [mobile];
        const contactUsResult = await pool.query(checkQuery, values);

        if (contactUsResult.rows.length > 0) {
          return res.status(400).send({
            success: false,
            message: "Contact number already exists, try a different number.",
            statusCode: 400,
          });
        } else {
          query += `, mobile_number='${mobile_number}'`;
        }
      }
      if (address1 !== undefined) {
        query += `, address1='${address1}'`;
      }
      if (address2 !== undefined) {
        query += `, address2='${address2}'`;
      }
      if (city !== undefined) {
        query += `, city='${city}'`;
      }
      if (state !== undefined) {
        query += `, state='${state}'`;
      }
      if (pincode !== undefined) {
        query += `, pincode='${pincode}'`;
      }
      if (social_media_profile_link !== undefined) {
        query += `, social_media_profile_link='${social_media_profile_link}'`;
      }
      if (is_kyc_verified !== undefined) {
        query += `, is_kyc_verified=${is_kyc_verified}`;
      }

      // console.log(`query: ${query}`);
      // console.log('request: ', req);

      if (is_portfolio_updated !== undefined) {
        // console.log("is_portfolio_updated", is_portfolio_updated);
        const getFilesQuery = `SELECT artist_portfolio FROM artist WHERE artist_id = ${artist_id}`;
        const getFileResponse = await pool.query(getFilesQuery);
        if (!lodash.isEmpty(getFileResponse.rows)) {
          if (getFileResponse.rows[0].artist_portfolio != null) {
            fs.promises.unlink(
              userPortFoliaImagePath + getFileResponse.rows[0].artist_portfolio
            );
          }
          if (portfolio_image == null) {
            query += `, artist_portfolio=null`;
          } else {
            const portfolioImagePath = portfolio_image[0].filepath;
            const filename =
              artist_id + "_" + Date.now() + `.${portfolio_file_ext}`;
            const portfolioFolderPath = userPortFoliaImagePath + filename;
            try {
              fileUpload(portfolioImagePath, portfolioFolderPath);
              query += `, artist_portfolio='${filename}'`;
            } catch (err) {
              portfolioImageUploadError = err;
            }
          }
        }
      }

      // console.log("mocInsertQuery: ", Array.isArray(mocs));

      if (is_moc_update !== undefined) {
        let deleteQuery = `DELETE FROM artist_moc WHERE artist_id = ${artist_id}`;
        const deleteResult = await pool.query(deleteQuery);

        if (!lodash.isEmpty(mocs)) {
          // Parse the JSON string into an array of objects
          const mocsArray = JSON.parse(mocs[0]);

          // Construct the values string for the INSERT query
          let values = mocsArray
            .map((e) => `(${artist_id}, ${e.id})`)
            .join(", ");

          // Construct the INSERT query
          let mocInsertQuery = `INSERT INTO artist_moc(artist_id, moc_id) VALUES ${values}`;

          // Execute the INSERT query
          const mocInsertResult = await pool.query(mocInsertQuery);
          // console.log("mocInsertResult:", JSON.stringify(mocInsertResult));
        }
      }

      if (is_profile_pic_updated !== undefined) {
        const getFilesQuery = `SELECT profile_pic FROM artist WHERE artist_id = ${artist_id}`;
        const getProfileResponse = await pool.query(getFilesQuery);
        if (!lodash.isEmpty(getProfileResponse.rows)) {
          if (getProfileResponse.rows[0].profile_pic != null) {
            fs.promises.unlink(
              userProfileImagePath + getProfileResponse.rows[0].profile_pic
            );
          }
          if (profile_image == null) {
            query += `, profile_pic=null`;
          } else {
            const profileImagePath = profile_image[0].filepath;
            const filename =
              artist_id + "_" + Date.now() + `.${profile_pic_file_ext}`; // + "." + profile_image[0].originalFilename.split(".").pop();
            const profileFolderPath = userProfileImagePath + filename;
            try {
              fileUpload(profileImagePath, profileFolderPath);
              query += `, profile_pic='${filename}'`;
            } catch (err) {
              profileImageUploadError = err;
            }
          }
        }
      }

      query += ` WHERE artist_id=${artist_id}`;
      // console.log(`query: ${query}`);
      pool.query(query, async (err, result) => {
        // console.log(`err: ${err}`);
        // console.log(`result: ${JSON.stringify(result)}`);
        if (err) {
          if (err.detail === `Key (email)=(${email}) already exists.`) {
            res.status(400).send({
              success: false,
              message:
                "Email Id already Exist, try different email or sign in.",
              statusCode: 400,
            });
          } else {
            res.status(500).send({
              success: false,
              message: err,
              statusCode: 500,
            });
          }
        } else {
          getArtistDetails(
            artist_id,
            "User Details Updated Successfully",
            res,
            req
          );
        }
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
