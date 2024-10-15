const pool = require("../../config/db");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");
const { fileUpload } = require("../../utils/fileUpload");
const formidable = require("formidable");
const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");
const { query } = require("express");

exports.submitGrantController = async (req, res) => {
  // console.log(`req.body: ${JSON.stringify()}`)
  const allowedFileExtensions = [".jpeg", ".jpg", ".png", ".psd", ".pdf"];

  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      let {
        artist_id,
        grant_id,
        art_title,
        art_height,
        art_width,
        art_description,
        art_file_extension,
        mocs,
      } = fields;
      console.log("req body", mocs);

      if (Object.keys(fields).length === 0) {
        res.status(500).send({
          success: false,
          message: "Pass data in body",
          statusCode: 500,
        });
      }
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
        totalCount === submitGrantValidationResult?.rows[0]?.max_allow_submision
      ) {
        res.status(500).send({
          success: false,
          message:
            "The maximum allowed submissions have been completed. No further submissions are accepted at this time.",
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
            const artFile = files["art_file"];
            let artImageUploadError;
            if (artFile != undefined) {
              const artImagePath = artFile[0].filepath;
              const filename =
                artist_id +
                "_" +
                grant_id +
                "_" +
                Date.now() +
                `.${art_file_extension}`;
              const artFolderPath = artistGrantSubmissionFilesPath + filename;
              try {
                fileUpload(artImagePath, artFolderPath);
              } catch (err) {
                artImageUploadError = err;
              }

              const description =
                typeof art_description === "string"
                  ? art_description.replace(/'/g, "''")
                  : "";

              const query = `INSERT INTO submission_details(
                artist_id, transaction_id, grant_id, art_file, art_title, height, width, art_description, status)
                VALUES (${artist_id}, '${transactionId}', ${grant_id}, '${filename}', '${art_title}', ${art_height}, ${art_width}, '${description}', 'SUBMITTED') RETURNING id`;

              console.log("qyert", query);
              pool.query(query, async (err, result) => {
                // console.log(`insert error: ${err}`);
                if (err) {
                  console.log(`insert error: ${err}`);
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
                  res.status(200).send({
                    success: false,
                    message: "Artwork Submitted Successfully.",
                    statusCode: 200,
                  });
                }
              });
            } else {
              res.status(500).send({
                success: false,
                message: "Please add art file.",
                statusCode: 500,
              });
            }
          } else {
            // await getGrantSubmittedDetails(
            //   grantAlreadySubmittedResult.rows[0].id,
            //   "Grant already submitted.",
            //   res,
            //   req
            // );
            console.log("error", err);
            res.status(500).send({
              success: false,
              message:
                "The maximum allowed submissions have been completed. No further submissions are accepted at this time.",
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
    });
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
