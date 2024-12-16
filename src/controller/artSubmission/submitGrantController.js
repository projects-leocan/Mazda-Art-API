// const pool = require("../../config/db");
// const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
// const { getUTCdate } = require("../../constants/getUTCdate");
// const { somethingWentWrong } = require("../../constants/messages");
// const lodash = require("lodash");
// const { fileUpload } = require("../../utils/fileUpload");
// const formidable = require("formidable");
// const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");
// const { query } = require("express");
// const multer = require("multer");
// require("dotenv").config();
// const path = require("path");
// const { sendEmail } = require("../emailControllers/sendEmailController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "art_files") {
//       cb(null, "src/files/artist_grant_submission_files/");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage }).fields([
//   { name: "art_files", maxCount: 100 },
// ]);

// exports.submitGrantController = async (req, res) => {
//   console.log(`req.body:`, req);
//   upload(req, res, async (err) => {
//     const allowedFileExtensions = [".jpeg", ".jpg", ".png", ".psd", ".pdf"];
//     if (err) {
//       return res.status(400).send({ error: err.message });
//     }
//     try {
//       var form = new formidable.IncomingForm();
//       // form.parse(req, async function (err, fields, files) {
//       let {
//         artist_id,
//         grant_id,
//         art_title,
//         art_height,
//         art_width,
//         art_description,
//         art_file_extension,
//         mocs,
//         no_of_submission,
//       } = req.body;
//       console.log("req body", fields);
//       console.log("req body files", files);

//       const client = await pool.connect();

//       const submitGrantValidationQuery = `SELECT * FROM grants WHERE grant_id = ${grant_id}`;
//       const submitGrantValidationResult = await pool.query(
//         submitGrantValidationQuery
//       );

//       // Submission Count

//       const submitGrantCountQuery = `SELECT COUNT(id) FROM submission_details WHERE grant_id = ${grant_id}`;
//       const submitGrantCountResult = await pool.query(submitGrantCountQuery);
//       const totalCount = submitGrantCountResult?.rows[0];
//       const date = new Date();

//       submitGrantValidationResult.rows[0].submission_end_date = getUTCdate(
//         submitGrantValidationResult.rows[0].submission_end_date
//       );

//       if (
//         submitGrantValidationResult.rowCount === 0 ||
//         lodash.isEmpty(submitGrantValidationResult.rows)
//       ) {
//         res.status(500).send({
//           success: false,
//           message: "Grant not Found.",
//           statusCode: 500,
//         });
//       } else if (
//         submitGrantValidationResult.rows[0].submission_end_date < date
//       ) {
//         res.status(500).send({
//           success: false,
//           message: "Grant Submission date is passed.",
//           statusCode: 500,
//         });
//       } else {
//         const transactionQuery = `SELECT * FROM trasaction_detail WHERE artist_id = ${artist_id} AND grant_id = ${grant_id} AND trasaction_status = 'SUCCESS'`;

//         const transactionResult = await pool.query(transactionQuery);
//         // console.log('transactionResult: ', transactionResult);

//         if (
//           !lodash.isEmpty(transactionResult.rows) &&
//           transactionResult.rows[0].trasaction_status != undefined &&
//           transactionResult.rows[0].trasaction_status === "SUCCESS"
//         ) {
//           // grant already submitted

//           const grantAlreadySubmittedQuery = `SELECT * FROM submission_details WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;
//           const grantAlreadySubmittedResult = await pool.query(
//             grantAlreadySubmittedQuery
//           );

//           if (grantAlreadySubmittedResult.rowCount === 0) {
//             // transaction details
//             const transactionId = transactionResult.rows[0].id;

//             // file upload for grant
//             // const artFile = files["art_file"];
//             const artFiles = req.files.art_files
//               ? req.files.art_files.map((file) => file.filename)
//               : [];

//             let artImageUploadError;

//             const description = art_description.replace(/'/g, "''");

//             const query = `INSERT INTO submission_details(
//                   artist_id, transaction_id, grant_id, art_title, height, width, art_description, status, no_of_submission)
//                   VALUES (${artist_id}, '${transactionId}', ${grant_id}, '${art_title}', ${art_height}, ${art_width}, '${description}', 'SUBMITTED', ${no_of_submission}) RETURNING id`;

//             // console.log("qyert", query);
//             pool.query(query, async (err, result) => {
//               console.log(`insert error: ${err}`);
//               if (err) {
//                 res.status(500).send({
//                   success: false,
//                   message: somethingWentWrong,
//                   statusCode: 500,
//                 });
//               } else {
//                 const submissionId = result.rows[0].id;

//                 if (!lodash.isEmpty(mocs)) {
//                   // Parse the JSON string into an array of objects

//                   const mocsArray = JSON.parse(mocs);

//                   // Construct the values string for the INSERT query
//                   let values = mocsArray
//                     .map((e) => `(${artist_id}, ${submissionId}, ${e.id})`)
//                     .join(", ");
//                   // Construct the INSERT query
//                   let mocInsertQuery = `INSERT INTO artist_artwork_moc(artist_id, artwork_id, moc_id) VALUES ${values}`;

//                   // Execute the INSERT query
//                   const mocInsertResult = await pool.query(mocInsertQuery);
//                 }

//                 if (artFiles.length > 0) {
//                   const portfolioQuery = `
//                     INSERT INTO artist_artwork_submission (artwork_id, grant_id, artist_id, art_file)
//                     VALUES ${artFiles
//                       .map(
//                         (_, i) =>
//                           `(${submissionId}, ${grant_id}, ${artist_id}, $${
//                             i + 1
//                           })`
//                       )
//                       .join(", ")}
//                   `;
//                   const portfolioValues = [...artFiles];

//                   await pool.query(portfolioQuery, portfolioValues);

//                   // console.log("portfolioQuery", portfolioQuery);
//                 }

//                 res.status(200).send({
//                   success: false,
//                   message: "Artwork Submitted Successfully.",
//                   statusCode: 200,
//                 });

//                 const grantUidQuery = `SELECT grant_uid from grants where grant_id=${grant_id}`;

//                 const artistInfoQuery = `SELECT fname, lname, email from artist where artist_id=${artist_id}`;

//                 const grantUidQueryExecute = await pool.query(grantUidQuery);
//                 const artistInfoQueryExecute = await pool.query(
//                   artistInfoQuery
//                 );

//                 sendEmail(artistInfoQueryExecute?.rows[0]?.email, "2", {
//                   grant_id: grantUidQueryExecute?.rows[0]?.grant_uid,
//                   name: `${artistInfoQueryExecute?.rows[0]?.fname} ${artistInfoQueryExecute?.rows[0]?.lname}`,
//                 });
//               }
//             });
//           } else {
//             console.log("error", err);
//             res.status(500).send({
//               success: false,
//               message: "Something went wrong",
//               statusCode: 500,
//             });
//           }
//         } else {
//           console.log("error", error);
//           res.status(500).send({
//             success: false,
//             message: "Please add payment for this Grant first.",
//             statusCode: 500,
//           });
//         }
//       }
//       // });
//     } catch (error) {
//       console.log(`error: ${error}`);
//       res.status(500).send({
//         success: false,
//         message: somethingWentWrong,
//         statusCode: 500,
//       });
//     }
//   });
// };

// const pool = require("../../config/db");
// const { getUTCdate } = require("../../constants/getUTCdate");
// const { somethingWentWrong } = require("../../constants/messages");
// const lodash = require("lodash");
// const multer = require("multer");
// const path = require("path");
// const { sendEmail } = require("../emailControllers/sendEmailController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "art_files") {
//       cb(null, "src/files/artist_grant_submission_files/");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage }).fields([
//   { name: "art_files", maxCount: 100 },
// ]);

// exports.submitGrantController = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).send({ error: err.message });
//     }
//     console.log("req", req.body);

//     console.log("req", JSON.parse(req.body.artwork_submissions));

//     try {
//       const {
//         artist_id,
//         grant_id,
//         no_of_submission,
//         artwork_submissions = [],
//       } = req.body;

//       const client = await pool.connect();
//       const date = new Date();

//       const submitGrantValidationQuery = `SELECT * FROM grants WHERE grant_id = ${grant_id}`;
//       const submitGrantValidationResult = await pool.query(
//         submitGrantValidationQuery
//       );

//       if (
//         submitGrantValidationResult.rowCount === 0 ||
//         lodash.isEmpty(submitGrantValidationResult.rows)
//       ) {
//         return res.status(500).send({
//           success: false,
//           message: "Grant not Found.",
//           statusCode: 500,
//         });
//       }

//       const grantData = submitGrantValidationResult.rows[0];
//       grantData.submission_end_date = getUTCdate(grantData.submission_end_date);

//       if (grantData.submission_end_date < date) {
//         return res.status(500).send({
//           success: false,
//           message: "Grant Submission date is passed.",
//           statusCode: 500,
//         });
//       }

//       const transactionQuery = `SELECT * FROM trasaction_detail WHERE artist_id = ${artist_id} AND grant_id = ${grant_id} AND trasaction_status = 'SUCCESS'`;
//       const transactionResult = await pool.query(transactionQuery);

//       if (
//         !lodash.isEmpty(transactionResult.rows) &&
//         transactionResult.rows[0].trasaction_status === "SUCCESS"
//       ) {
//         const transactionId = transactionResult.rows[0].id;

//         const grantAlreadySubmittedQuery = `SELECT * FROM submission_details WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;
//         const grantAlreadySubmittedResult = await pool.query(
//           grantAlreadySubmittedQuery
//         );

//         if (grantAlreadySubmittedResult.rowCount === 0) {
//           const artworkQueries = JSON.parse(artwork_submissions).map(
//             (submission, index) => {
//               // const artFile = artFiles[index] ? artFiles[index].filename : null;
//               return `('${submission?.art_title}', '${
//                 submission?.art_height
//               }', '${
//                 submission.art_width
//               }', '${submission.art_description.replace(
//                 /'/g,
//                 "''"
//               )}', '${JSON.parse(submission.art_file)}' )`;
//             }
//           );
//           // const query = `INSERT INTO submission_details(
//           //   artist_id, transaction_id, grant_id, status, no_of_submissiont)
//           //   VALUES (${artist_id}, '${transactionId}', ${grant_id}, 'SUBMITTED', ${no_of_submission}) RETURNING id`;

//           const query = `INSERT INTO submission_details(
//               artist_id, transaction_id, grant_id, art_title, height, width, art_description, art_file, status, no_of_submissions)
//               VALUES (${artist_id}, '${transactionId}', ${grant_id}, ${artworkQueries.join(
//             ", "
//           )}, 'SUBMITTED', ${no_of_submission}) RETURNING id`;

//           console.log("query submission_details", query);
//           const result = await pool.query(query);
//           const submissionId = result.rows[0].id;

//           if (artwork_submissions.length > 0) {
//             const artFiles = req.files.art_files || [];

//             const artworkQueries = JSON.parse(
//               req.body.artwork_submissions
//             )?.map((submission, index) => {
//               const artFile = artFiles[index] ? artFiles[index].filename : null;
//               return `(${submissionId}, ${grant_id}, ${artist_id}, '${
//                 submission.art_title
//               }', '${submission.art_height}', '${
//                 submission.art_width
//               }', '${submission.art_description.replace(/'/g, "''")}', '${
//                 submission.art_file_extension
//               }', '${artFile}')`;
//             });

//             // const portfolioQuery = `INSERT INTO artist_artwork_submission (
//             //   artwork_id, grant_id, artist_id, art_title, height, width, art_description, art_file_extension, art_file
//             // ) VALUES ${artworkQueries.join(", ")`;

//             // await pool.query(portfolioQuery);
//           }

//           res.status(200).send({
//             success: true,
//             message: "Artwork Submitted Successfully.",
//             statusCode: 200,
//           });

//           const grantUidQuery = `SELECT grant_uid from grants where grant_id=${grant_id}`;
//           const artistInfoQuery = `SELECT fname, lname, email from artist where artist_id=${artist_id}`;

//           const grantUidQueryExecute = await pool.query(grantUidQuery);
//           const artistInfoQueryExecute = await pool.query(artistInfoQuery);

//           sendEmail(artistInfoQueryExecute?.rows[0]?.email, "2", {
//             grant_id: grantUidQueryExecute?.rows[0]?.grant_uid,
//             name: `${artistInfoQueryExecute?.rows[0]?.fname} ${artistInfoQueryExecute?.rows[0]?.lname}`,
//           });
//         } else {
//           res.status(500).send({
//             success: false,
//             message: "Grant already submitted.",
//             statusCode: 500,
//           });
//         }
//       } else {
//         res.status(500).send({
//           success: false,
//           message: "Please add payment for this Grant first.",
//           statusCode: 500,
//         });
//       }

//       client.release();
//     } catch (error) {
//       console.log("errr", error);
//       res.status(500).send({
//         success: false,
//         message: somethingWentWrong,
//         statusCode: 500,
//       });
//     }
//   });
// };

const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");
const multer = require("multer");
const path = require("path");
const { sendEmail } = require("../emailControllers/sendEmailController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/files/artist_grant_submission_files/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Updated Multer configuration to handle any file fields
const upload = multer({ storage }).any();

const pool = require("../../config/db");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { fileUpload } = require("../../utils/fileUpload");
const formidable = require("formidable");
const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");
const { query } = require("express");
require("dotenv").config();

exports.submitGrantController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    // console.log("req body", req.body);
    // console.log("req files", req.files);

    try {
      const { artist_id, grant_id, no_of_submission } = req.body;
      const rawArtworkSubmissions = req.body.artwork_submissions; // Get raw submissions array

      // Parse each submission string
      const artworkSubmissions = rawArtworkSubmissions
        .map((submission) => {
          try {
            return JSON.parse(submission); // Parse each submission
          } catch (error) {
            console.error("Failed to parse submission:", submission);
            return null; // Return null for invalid JSON
          }
        })
        .filter((submission) => submission !== null); // Remove any invalid submissions

      const files = req.files; // Uploaded files

      if (artworkSubmissions.length === 0) {
        return res.status(400).send({
          success: false,
          message: "Invalid artwork submissions format.",
          statusCode: 400,
        });
      }

      const client = await pool.connect();
      const date = new Date();

      // Validate the grant
      const submitGrantValidationQuery = `SELECT * FROM grants WHERE grant_id = ${grant_id}`;
      const submitGrantValidationResult = await pool.query(
        submitGrantValidationQuery
      );

      if (
        submitGrantValidationResult.rowCount === 0 ||
        lodash.isEmpty(submitGrantValidationResult.rows)
      ) {
        return res.status(500).send({
          success: false,
          message: "Grant not Found.",
          statusCode: 500,
        });
      }

      const grantData = submitGrantValidationResult.rows[0];
      grantData.submission_end_date = getUTCdate(grantData.submission_end_date);

      if (grantData.submission_end_date < date) {
        return res.status(500).send({
          success: false,
          message: "Grant Submission date is passed.",
          statusCode: 500,
        });
      }

      // Validate the transaction
      const transactionQuery = `
        SELECT * FROM trasaction_detail 
        WHERE artist_id = ${artist_id} AND grant_id = ${grant_id} AND trasaction_status = 'SUCCESS'
      `;
      const transactionResult = await pool.query(transactionQuery);

      if (
        lodash.isEmpty(transactionResult.rows) ||
        transactionResult.rows[0].trasaction_status !== "SUCCESS"
      ) {
        return res.status(500).send({
          success: false,
          message: "Please add payment for this Grant first.",
          statusCode: 500,
        });
      }

      const transactionId = transactionResult.rows[0].id;

      // Check for existing submissions
      const grantAlreadySubmittedQuery = `
        SELECT * FROM submission_details 
        WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}
      `;
      const grantAlreadySubmittedResult = await pool.query(
        grantAlreadySubmittedQuery
      );

      if (grantAlreadySubmittedResult.rowCount > 0) {
        return res.status(400).send({
          success: false,
          message: "You have already submitted for this grant.",
          statusCode: 400,
        });
      }

      // Insert submission details and related data
      for (let i = 0; i < artworkSubmissions.length; i++) {
        const submission = artworkSubmissions[i];
        // const file = files[`artwork_submissions[${i}][art_file]`];
        const file = files[i];
        if (!file) {
          return res.status(400).send({
            success: false,
            message: `File for submission ${i + 1} is missing.`,
            statusCode: 400,
          });
        }

        const description = submission.art_description.replace(/'/g, "''");

        const submissionQuery = `
          INSERT INTO submission_details(
            artist_id, transaction_id, grant_id, art_title, height, width, art_description, art_file, status, no_of_submission
          ) VALUES (
            ${artist_id}, '${transactionId}', ${grant_id}, '${submission.art_title}', 
            ${submission.art_height}, ${submission.art_width}, '${description}', '${file.filename}', 'SUBMITTED', ${no_of_submission}
          ) RETURNING id
        `;

        const submissionResult = await pool.query(submissionQuery);
        const submissionId = submissionResult.rows[0].id;

        // Insert MOCs
        if (submission.mocs && submission.mocs.length > 0) {
          const mocsArray = submission.mocs;
          const mocsValues = mocsArray
            .map((moc) => `(${artist_id}, ${submissionId}, ${moc.id})`)
            .join(", ");

          const mocInsertQuery = `
            INSERT INTO artist_artwork_moc(artist_id, artwork_id, moc_id) 
            VALUES ${mocsValues}
          `;
          await pool.query(mocInsertQuery);
        }

        // Insert file record into submission_details
        // const fileQuery = `
        //   INSERT INTO submission_details (artwork_id, grant_id, artist_id, art_file)
        //   VALUES (${submissionId}, ${grant_id}, ${artist_id}, '${file.filename}')
        // `;
        // await pool.query(fileQuery);
      }

      // Send response
      res.status(200).send({
        success: true,
        message: "Artwork Submitted Successfully.",
        statusCode: 200,
      });

      // Send email notification
      const grantUidQuery = `SELECT grant_uid FROM grants WHERE grant_id = ${grant_id}`;
      const artistInfoQuery = `SELECT fname, lname, email FROM artist WHERE artist_id = ${artist_id}`;

      const [grantUidResult, artistInfoResult] = await Promise.all([
        pool.query(grantUidQuery),
        pool.query(artistInfoQuery),
      ]);

      const grantUid = grantUidResult.rows[0]?.grant_uid;
      const artistInfo = artistInfoResult.rows[0];
      sendEmail(artistInfo.email, "2", {
        grant_id: grantUid,
        name: `${artistInfo.fname} ${artistInfo.lname}`,
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    }
  });
};
