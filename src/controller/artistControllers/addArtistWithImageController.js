const pool = require("../../config/db");
const multer = require("multer");
const path = require("path");
// const { passwordHashing } = require("../../constants/passwordHashing");
const { somethingWentWrong } = require("../../constants/messages");
var lodash = require("lodash");
const { sendEmail } = require("../emailControllers/sendEmailController");

const { sendOtp } = require("../otpVerificationController/sendOtp");
require("dotenv").config();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_pic") {
      cb(null, "src/files/artist_profile/");
    } else if (file.fieldname === "artist_portfolio") {
      cb(null, "src/files/artist_portfolio/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).fields([
  { name: "profile_pic", maxCount: 1 },
  { name: "artist_portfolio", maxCount: 10 },
]);

exports.addArtistWithImageController = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // console.log("err", err);
      return res.status(400).send({ error: err.message });
    }

    const {
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
      password,
      is_kyc_verified,
      mocs,
    } = req.body;

    try {
      // const hashedPassword = await passwordHashing(password);
      const createdAt = new Date().toISOString().slice(0, 10);
      const updatedAt = new Date().toISOString().slice(0, 10);
      const profilePic = req.files.profile_pic
        ? req.files.profile_pic[0].filename
        : null;
      const artistPortfolio = req.files.artist_portfolio
        ? req.files.artist_portfolio.map((file) => file.filename)
        : [];

      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        const kyc = is_kyc_verified === undefined ? 0 : is_kyc_verified;

        const mobile_number_query = `SELECT mobile_number FROM artist WHERE mobile_number = '${mobile_number}'`;

        const result = await client.query(mobile_number_query);

        if (lodash.isEmpty(result?.rows)) {
          const query = `
          INSERT INTO artist (
            fname, lname, dob, gender, email, mobile_number, address1, address2,
            city, state, pincode, social_media_profile_link, password,
            is_kyc_verified, profile_pic, created_at, updated_at
          ) VALUES ('${fname}', '${lname}', '${dob}', '${gender}', '${email}', ${mobile_number}, '${address1}', '${address2}',
           '${city}', '${state}', ${pincode}, '${social_media_profile_link}', '',
           '${kyc}', '${profilePic}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING artist_id
        `;

          // console.log("query", query);

          const result = await client.query(query);
          const artistId = result.rows[0].artist_id;

          if (!lodash.isEmpty(mocs)) {
            // Parse the JSON string into an array of objects

            const mocsArray = JSON.parse(mocs);

            // Construct the values string for the INSERT query
            let values = mocsArray
              .map((e) => `(${artistId}, ${e.id})`)
              .join(", ");
            // Construct the INSERT query
            let mocInsertQuery = `INSERT INTO artist_moc(artist_id, moc_id) VALUES ${values}`;

            // Execute the INSERT query
            const mocInsertResult = await pool.query(mocInsertQuery);
          }

          if (artistPortfolio.length > 0) {
            const portfolioQuery = `
            INSERT INTO artist_portfolio (artist_id, artist_portfolio)
            VALUES ${artistPortfolio
              .map((_, i) => `($1, $${i + 2})`)
              .join(", ")}
          `;
            const portfolioValues = [artistId, ...artistPortfolio];

            await client.query(portfolioQuery, portfolioValues);
          }

          await client.query("COMMIT");

          sendEmail(email, "1", {
            name: `${fname} ${lname}`,
            mobile_number: `${mobile_number}`,
          });

          await sendOtp(mobile_number, res, req, "registration"); // Assuming sendOtpController takes mobile_number as an argument

          // res.status(200).send({
          //   success: true,
          //   message: "Artist added successfully",
          //   artistId,
          // });
        } else {
          res.status(500).send({
            success: false,
            message: `${mobile_number} is already exists.`,
            statusCode: 500,
          });
        }
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("rollback", error);
        if (error.detail === `Key (email)=(${email}) already exists.`) {
          res.status(500).send({
            success: false,
            message: `${email} is already exists.`,
            statusCode: 500,
          });
        } else {
          res.status(500).send({ success: false, message: somethingWentWrong });
        }
      } finally {
        client.release();
      }
    } catch (error) {
      // console.error("catch", error);
      res.status(500).send({ success: false, message: somethingWentWrong });
    }
  });
};
