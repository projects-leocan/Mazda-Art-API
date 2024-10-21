// const pool = require("../../config/db");
// const multer = require("multer");
// const path = require("path");
// const { passwordHashing } = require("../../constants/passwordHashing");
// const { somethingWentWrong } = require("../../constants/messages");

// // Set up multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "profile_pic") {
//       cb(null, "src/files/artist_profile/");
//     } else if (file.fieldname === "artist_portfolio") {
//       cb(null, "src/files/artist_portfolio/");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage }).fields([
//   { name: "profile_pic", maxCount: 1 },
//   { name: "artist_portfolio", maxCount: 10 }
// ]);

// exports.addArtistWithImageController = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).send({ error: err.message });
//     }

//     const {
//       fname,
//       lname,
//       dob,
//       gender,
//       email,
//       mobile_number,
//       address1,
//       address2,
//       city,
//       state,
//       pincode,
//       social_media_profile_link,
//       password,
//       is_kyc_verified
//     } = req.body;

//     try {
//       const hashedPassword = await passwordHashing(password);
//       const createdAt = new Date();
//       const updatedAt = new Date();
//       const profilePic = req.files.profile_pic ? req.files.profile_pic[0].filename : null;
//       const artistPortfolio = req.files.artist_portfolio ? req.files.artist_portfolio.map(file => file.filename) : [];

//       const query = `
//         INSERT INTO artist (
//           fname, lname, dob, gender, email, mobile_number, address1, address2,
//           city, state, pincode, social_media_profile_link, password,
//           is_kyc_verified, profile_pic, artist_portfolio, created_at, updated_at
//         ) VALUES (${fname}, ${lname}, ${dob}, ${gender}, ${email}, ${mobile_number}, ${address1}, ${address2},
//         ${city}, ${state}, ${pincode}, ${social_media_profile_link}, ${hashedPassword},
//         ${is_kyc_verified}, ${profilePic}, ${JSON.stringify(artistPortfolio)}, ${createdAt}, ${updatedAt})
//         RETURNING artist_id
//       `;
//       const values = [
//         fname, lname, dob, gender, email, mobile_number, address1, address2,
//         city, state, pincode, social_media_profile_link, hashedPassword,
//         is_kyc_verified, profilePic, JSON.stringify(artistPortfolio), createdAt, updatedAt
//       ];

//       console.log("query", query)

//       const result = await pool.query(query);
//       res.status(200).send({ success: true, message: "Artist added successfully", artistId: result.rows[0].artist_id });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ success: false, message: somethingWentWrong });
//     }
//   });
// };

const pool = require("../../config/db");
const multer = require("multer");
const path = require("path");
const { passwordHashing } = require("../../constants/passwordHashing");
const { somethingWentWrong } = require("../../constants/messages");
var lodash = require("lodash");
require("dotenv").config();

// Set up multer for file storage
const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     if (file.fieldname === "profile_pic") {
  //       cb(null, "src/files/user_profile/");
  //     } else if (file.fieldname === "user_portfolio") {
  //       cb(null, "src/files/user_portfolio/");
  //     }
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, Date.now() + path.extname(file.originalname));
  //   },
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
  const sgMail = require("@sendgrid/mail");

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
      const hashedPassword = await passwordHashing(password);
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
        const query = `
          INSERT INTO artist (
            fname, lname, dob, gender, email, mobile_number, address1, address2,
            city, state, pincode, social_media_profile_link, password,
            is_kyc_verified, profile_pic, created_at, updated_at
          ) VALUES ('${fname}', '${lname}', '${dob}', '${gender}', '${email}', ${mobile_number}, '${address1}', '${address2}',
           '${city}', '${state}', ${pincode}, '${social_media_profile_link}', '${hashedPassword}',
           '${kyc}', '${profilePic}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING artist_id
        `;

        // console.log("query", query);

        // const values = [
        //     fname, lname, dob, gender, email, mobile_number, address1, address2,
        //     city, state, pincode, social_media_profile_link, hashedPassword,
        //     is_kyc_verified, profilePic, createdAt, updatedAt
        // ];

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

        const API_KEY = process.env.SENDGRID_API_KEY;

        sgMail.setApiKey(API_KEY);
        const message = {
          to: email,
          from: { name: "Mazda Art", email: "bhavya.leocan@gmail.com" },
          // subject: "Welcome to Mazda Art!",
          // text: `Dear ${result?.rows[0]?.fname} ${result?.rows[0]?.lname},\n\nWelcome to the Mazda Art community! We are thrilled to have you on board. We hope you enjoy being part of our journey and look forward to seeing the amazing creations you'll bring to life.\n\nIf you ever need assistance or just want to connect, feel free to reach out. Let's make art that inspires!\n\nWarm regards,\nMazda Art Team`,
          // html: `
          //   <h1>Welcome to Mazda Art, ${result?.rows[0]?.fname} ${result?.rows[0]?.lname}!</h1>
          //   <p>We are absolutely delighted to have you join our artistic community! At Mazda Art, we believe in the power of creativity and expression, and we’re excited to see how you’ll contribute to our shared vision.</p>
          //   <p>Whether you're looking for inspiration, collaboration, or simply want to explore, we're here to support your journey every step of the way. If you need any help or have any questions, don’t hesitate to reach out.</p>
          //   <p>Let’s create something extraordinary together!</p>
          //   <br/>
          //   <p>Warm regards,</p>
          //   <p><strong>Mazda Art Team</strong></p>
          // `,
          templateId: "d-fefb690939134bc485e443f5e8d3f3da",
          dynamicTemplateData: {
            name: `${fname} ${lname}`,
          },
        };

        sgMail
          .send(message)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });

        res.status(200).send({
          success: true,
          message: "Artist added successfully",
          artistId,
        });
      } catch (error) {
        await client.query("ROLLBACK");
        // console.error(error);
        res.status(500).send({ success: false, message: somethingWentWrong });
      } finally {
        client.release();
      }
    } catch (error) {
      // console.error(error);
      res.status(500).send({ success: false, message: somethingWentWrong });
    }
  });
};
