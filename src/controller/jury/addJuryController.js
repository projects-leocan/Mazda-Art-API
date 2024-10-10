const pool = require("../../config/db");
const _ = require("lodash");
const { passwordHashing } = require("../../constants/passwordHashing");
const { getJuryDetails } = require("./juryDetail");
const { somethingWentWrong } = require("../../constants/messages");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_pic") {
      cb(null, "src/files/jury_profile/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).fields([
  { name: "profile_pic", maxCount: 1 },
]);

exports.addJuryController = async (req, res) => {
  upload(req, res, async (err) => {
    const {
      fullName,
      email,
      contact_no,
      password,
      address,
      designation,
      DOB,
      about,
      links,
    } = req.body;
    console.log("req body", req.body);
    try {
      const currentTime = new Date().toISOString().slice(0, 10);
      // const id = new Date().getTime();
      const profilePic = req.files.profile_pic
        ? req.files.profile_pic[0].filename
        : null;

      const checkQuery = `SELECT * FROM jury WHERE contact_no = $1`;
      const values = [contact_no];

      pool.query(checkQuery, values, async (checkErr, checkResult) => {
        if (checkErr) {
          console.log("check err", checkErr);
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

        const hashedPassword = await passwordHashing(password);

        const query = `INSERT INTO jury(
            full_name, email, contact_no, password, address, designation, dob, about, profile_pic, created_at, updated_at)
            VALUES ('${fullName}', '${email}', ${contact_no}, '${hashedPassword}', '${address}', '${designation}', '${DOB}', '${about}', '${profilePic}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`;

        pool.query(query, async (err, result) => {
          console.log(`Error: ${err}`);

          // console.log(`query: ${query}`);
          // console.log(`result: ${JSON.stringify(result)}`);
          if (err) {
            // console.log(`err: ${err}`);
            if (err.detail === `Key (email)=(${email}) already exists.`) {
              res.status(500).send({
                success: false,
                message:
                  "Email Id already Exist, try different email or sign in.",
                statusCode: 500,
              });
            } else {
              console.log(`err: ${err}`);
              res.status(500).send({
                success: false,
                message: somethingWentWrong,
                statusCode: 500,
              });
            }
          } else {
            if (!_.isEmpty(links)) {
              // add links in link master table
              let linkQuery = `INSERT INTO jury_links(jury_id, link) VALUES `;
              const last = links[links.length - 1];
              links.map((e) => {
                if (e === last) {
                  linkQuery += `(${result.rows[0].id}, '${e}')`;
                } else {
                  linkQuery += `(${result.rows[0].id}, '${e}'), `;
                }
              });
              // console.log(`linkQuery: ${linkQuery}`);

              // get latest inserted data
              pool.query(linkQuery, async (linkError, linkResult) => {
                // console.log(`err: ${err}`);
                // console.log(`linkResult: ${JSON.stringify(linkResult)}`);
                if (linkError) {
                  await getJuryDetails(
                    linkResult.rows[0].id,
                    "Jury added success, failed to add links for Jury",
                    res,
                    req
                  );
                } else {
                  await getJuryDetails(
                    result.rows[0].id,
                    "Jury Inserted Successfully",
                    res,
                    req
                  );
                }
              });
            } else {
              getJuryDetails(
                result.rows[0].id,
                "Jury Inserted Successfully",
                res,
                req
              );
            }
          }
        });
      });
    } catch (error) {
      console.log(`error: ${error}`);
      return res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    }
  });
};
