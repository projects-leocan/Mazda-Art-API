const pool = require("../../config/db");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");
const { fileUpload } = require("../../utils/fileUpload");
const formidable = require("formidable");
const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");
const { query } = require("express");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const { sendEmail } = require("../emailControllers/sendEmailController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "art_files") {
      cb(null, "src/files/artist_grant_submission_files/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).fields([
  { name: "art_files", maxCount: 100 },
]);

exports.submitGrantController = async (req, res) => {
  // console.log(`req.body: ${JSON.stringify()}`)
  upload(req, res, async (err) => {
    const allowedFileExtensions = [".jpeg", ".jpg", ".png", ".psd", ".pdf"];
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    try {
      var form = new formidable.IncomingForm();
      // form.parse(req, async function (err, fields, files) {
      let {
        artist_id,
        grant_id,
        art_title,
        art_height,
        art_width,
        art_description,
        art_file_extension,
        mocs,
        no_of_submission,
      } = req.body;
      // console.log("req body", fields);
      // console.log("req body files", files);

      // if (Object.keys(fields).length === 0) {
      //   res.status(500).send({
      //     success: false,
      //     message: "Pass data in body",
      //     statusCode: 500,
      //   });
      // }
      const client = await pool.connect();

      const submitGrantValidationQuery = `SELECT * FROM grants WHERE grant_id = ${grant_id}`;
      const submitGrantValidationResult = await pool.query(
        submitGrantValidationQuery
      );

      // Submission Count

      const submitGrantCountQuery = `SELECT COUNT(id) FROM submission_details WHERE grant_id = ${grant_id}`;
      const submitGrantCountResult = await pool.query(submitGrantCountQuery);
      const totalCount = submitGrantCountResult?.rows[0];
      const date = new Date();

      submitGrantValidationResult.rows[0].submission_end_date = getUTCdate(
        submitGrantValidationResult.rows[0].submission_end_date
      );
      // console.log(`date: ${JSON.stringify(date)}`);
      // console.log(`submission_end_date: ${JSON.stringify(submitGrantValidationResult.rows[0].submission_end_date)}`);
      // console.log(`con: ${submitGrantValidationResult.rows[0].submission_end_date < date}`);

      if (
        submitGrantValidationResult.rowCount === 0 ||
        lodash.isEmpty(submitGrantValidationResult.rows)
      ) {
        res.status(500).send({
          success: false,
          message: "Grant not Found.",
          statusCode: 500,
        });
      } else if (
        submitGrantValidationResult.rows[0].submission_end_date < date
      ) {
        // console.log(
        //   `con: ${
        //     submitGrantValidationResult.rows[0].submission_end_date < date
        //   }`
        // );
        // console.log("Grant Submission date is passed.");
        res.status(500).send({
          success: false,
          message: "Grant Submission date is passed.",
          statusCode: 500,
        });
      } else {
        const transactionQuery = `SELECT * FROM trasaction_detail WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;

        const transactionResult = await pool.query(transactionQuery);
        // console.log('transactionResult: ', transactionResult);

        if (
          !lodash.isEmpty(transactionResult.rows) &&
          transactionResult.rows[0].trasaction_status != undefined &&
          transactionResult.rows[0].trasaction_status === "SUCCESS"
        ) {
          // grant already submitted

          const grantAlreadySubmittedQuery = `SELECT * FROM submission_details WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;
          const grantAlreadySubmittedResult = await pool.query(
            grantAlreadySubmittedQuery
          );

          if (grantAlreadySubmittedResult.rowCount === 0) {
            // transaction details
            const transactionId = transactionResult.rows[0].id;

            // file upload for grant
            // const artFile = files["art_file"];
            const artFiles = req.files.art_files
              ? req.files.art_files.map((file) => file.filename)
              : [];

            let artImageUploadError;
            // if (artFile != undefined) {
            // const artImagePath = artFile[0].filepath;
            // const filename =
            //   artist_id +
            //   "_" +
            //   grant_id +
            //   "_" +
            //   Date.now() +
            //   `.${art_file_extension}`;
            // const artFolderPath = artistGrantSubmissionFilesPath + filename;
            // try {
            //   fileUpload(artImagePath, artFolderPath);
            // } catch (err) {
            //   artImageUploadError = err;
            // }

            const description = art_description.replace(/'/g, "''");

            const query = `INSERT INTO submission_details(
                  artist_id, transaction_id, grant_id, art_title, height, width, art_description, status, no_of_submission)
                  VALUES (${artist_id}, '${transactionId}', ${grant_id}, '${art_title}', ${art_height}, ${art_width}, '${description}', 'SUBMITTED', ${no_of_submission}) RETURNING id`;

            // console.log("qyert", query);
            pool.query(query, async (err, result) => {
              // console.log(`insert error: ${err}`);
              if (err) {
                // console.log(`insert error: ${err}`);
                // console.log(`insert result: ${result}`);
                res.status(500).send({
                  success: false,
                  message: somethingWentWrong,
                  statusCode: 500,
                });
              } else {
                const submissionId = result.rows[0].id;
                // console.log(`submit req: ${JSON.stringify(req)}`)
                // await getGrantSubmittedDetails(
                //   submissionId,
                //   "Grant submitted Successfully.",
                //   res,
                //   req
                // );
                if (!lodash.isEmpty(mocs)) {
                  // Parse the JSON string into an array of objects

                  const mocsArray = JSON.parse(mocs);

                  // Construct the values string for the INSERT query
                  let values = mocsArray
                    .map((e) => `(${artist_id}, ${submissionId}, ${e.id})`)
                    .join(", ");
                  // Construct the INSERT query
                  let mocInsertQuery = `INSERT INTO artist_artwork_moc(artist_id, artwork_id, moc_id) VALUES ${values}`;

                  // Execute the INSERT query
                  const mocInsertResult = await pool.query(mocInsertQuery);
                }

                if (artFiles.length > 0) {
                  const portfolioQuery = `
                    INSERT INTO artist_artwork_submission (artwork_id, grant_id, artist_id, art_file)
                    VALUES ${artFiles
                      .map(
                        (_, i) =>
                          `(${submissionId}, ${grant_id}, ${artist_id}, $${
                            i + 1
                          })`
                      )
                      .join(", ")}
                  `;
                  const portfolioValues = [...artFiles];

                  await pool.query(portfolioQuery, portfolioValues);

                  // console.log("portfolioQuery", portfolioQuery);
                }

                res.status(200).send({
                  success: false,
                  message: "Artwork Submitted Successfully.",
                  statusCode: 200,
                });

                const grantUidQuery = `SELECT grant_uid from grants where grant_id=${grant_id}`;

                const artistInfoQuery = `SELECT fname, lname, email from artist where artist_id=${artist_id}`;

                const grantUidQueryExecute = await pool.query(grantUidQuery);
                const artistInfoQueryExecute = await pool.query(
                  artistInfoQuery
                );

                // const API_KEY = process.env.SENDGRID_API_KEY;

                // sgMail.setApiKey(API_KEY);
                // const message = {
                //   to: artistInfoQueryExecute?.rows[0]?.email,
                //   from: {
                //     name: process.env.SENDGRID_EMAIL_NAME,
                //     email: process.env.FROM_EMAIL,
                //   },

                //   templateId: process.env.ARTWORK_SUBMIT_TEMPLATE_ID,
                //   dynamicTemplateData: {
                //     grant_id: grantUidQueryExecute?.rows[0]?.grant_uid,
                //     name: `${artistInfoQueryExecute?.rows[0]?.fname} ${artistInfoQueryExecute?.rows[0]?.lname}`,
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

                sendEmail(artistInfoQueryExecute?.rows[0]?.email, "2", {
                  grant_id: grantUidQueryExecute?.rows[0]?.grant_uid,
                  name: `${artistInfoQueryExecute?.rows[0]?.fname} ${artistInfoQueryExecute?.rows[0]?.lname}`,
                });
              }
            });
            // }
            // else {
            //   res.status(500).send({
            //     success: false,
            //     message: "Please add art file.",
            //     statusCode: 500,
            //   });
            // }
          } else {
            // await getGrantSubmittedDetails(
            //   grantAlreadySubmittedResult.rows[0].id,
            //   "Grant already submitted.",
            //   res,
            //   req
            // );
            // console.log("error", err);
            res.status(500).send({
              success: false,
              message: "Something went wrong",
              statusCode: 500,
            });
          }
        } else {
          res.status(500).send({
            success: false,
            message: "Please add payment for this Grant first.",
            statusCode: 500,
          });
        }
      }
      // });
    } catch (error) {
      // console.log(`error: ${error}`);
      res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    }
  });
};
