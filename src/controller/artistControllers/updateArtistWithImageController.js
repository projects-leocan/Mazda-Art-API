const pool = require("../../config/db");
const multer = require("multer");
const path = require("path");
const { somethingWentWrong } = require("../../constants/messages");

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_pic") {
      cb(null, "uploads/profile_pics/");
    } else if (file.fieldname === "artist_portfolio") {
      cb(null, "uploads/portfolio/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).fields([
  { name: "profile_pic", maxCount: 1 },
  { name: "artist_portfolio", maxCount: 10 }
]);

exports.updateArtistWithImageController = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    const {
      artist_id,
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
      is_kyc_verified
    } = req.body;

    try {
      const updatedAt = new Date();
      const profilePic = req.files.profile_pic ? req.files.profile_pic[0].filename : null;
      const artistPortfolio = req.files.artist_portfolio ? req.files.artist_portfolio.map(file => file.filename) : [];

      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        let query = `
          UPDATE artists
          SET fname = $1, lname = $2, dob = $3, gender = $4, email = $5, mobile_number = $6,
              address1 = $7, address2 = $8, city = $9, state = $10, pincode = $11,
              social_media_profile_link = $12, is_kyc_verified = $13, updated_at = $14
        `;
        const values = [
          fname, lname, dob, gender, email, mobile_number, address1, address2,
          city, state, pincode, social_media_profile_link, is_kyc_verified, updatedAt
        ];

        if (profilePic) {
          query += `, profile_pic = $15 WHERE artist_id = $16`;
          values.push(profilePic, artist_id);
        } else {
          query += ` WHERE artist_id = $15`;
          values.push(artist_id);
        }

        await client.query(query, values);

        if (artistPortfolio.length > 0) {
          // Delete existing portfolio images
          await client.query('DELETE FROM artist_portfolio WHERE artist_id = $1', [artist_id]);

          const portfolioQuery = `
            INSERT INTO artist_portfolio (artist_id, artist_portfolio)
            VALUES ${artistPortfolio.map((_, i) => `($1, $${i + 2})`).join(", ")}
          `;
          const portfolioValues = [artist_id, ...artistPortfolio];

          await client.query(portfolioQuery, portfolioValues);
        }

        await client.query('COMMIT');
        res.status(200).send({ success: true, message: "Artist updated successfully" });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).send({ success: false, message: somethingWentWrong });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: somethingWentWrong });
    }
  });
};
