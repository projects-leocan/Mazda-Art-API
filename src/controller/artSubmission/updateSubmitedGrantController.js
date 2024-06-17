const pool = require("../../config/db");
const formidable = require("formidable");
const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");
var fs = require("fs");
const { somethingWentWrong } = require("../../constants/messages");
const { fileUpload } = require("../../utils/fileUpload");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const lodash = require("lodash");

exports.updateSubmitedGrantController = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      let {
        grant_submitted_id,
        artist_id,
        grant_id,
        art_title,
        art_height,
        art_width,
        art_description,
        art_file_extension,
        is_art_file_updated,
      } = fields;

      if (Object.keys(fields).length === 0) {
        res.status(500).send({
          success: false,
          message: "Pass data in body",
          statusCode: 500,
        });
      }
      if (grant_submitted_id === "" || lodash.isEmpty(grant_submitted_id)) {
        res.status(500).send({
          success: false,
          message: "grant_submitted_id can not be Empty.",
          statusCode: 500,
        });
      }
      const submitGrantValidationQuery = `SELECT * FROM grants WHERE grant_id = ${grant_id}`;
      const submitGrantValidationResult = await pool.query(
        submitGrantValidationQuery
      );
      const date = new Date();

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
        submitGrantValidationResult.rows[0].submission_end_date <= date
      ) {
        // console.log(`date: ${JSON.stringify(date)}`);
        // console.log(`con: ${submitGrantValidationResult.rows[0].submission_end_date >= date}`);
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

          if (grantAlreadySubmittedResult.rowCount > 0) {
            if (
              grantAlreadySubmittedResult.rows[0].submission_updated_count <
              submitGrantValidationResult.rows[0].max_allow_submision
            ) {
              // transaction details
              const transactionId = transactionResult.rows[0].trasaction_id;
              let filename;

              // file upload for grant
              if (is_art_file_updated) {
                fs.promises.unlink(
                  artistGrantSubmissionFilesPath +
                    grantAlreadySubmittedResult.rows[0].art_file
                );
                const artFile = files["art_file"];
                let artImageUploadError;
                if (artFile != undefined) {
                  const artImagePath = artFile[0].filepath;
                  filename =
                    artist_id + "_" + Date.now() + `.${art_file_extension}`;
                  const artFolderPath =
                    artistGrantSubmissionFilesPath + filename;
                  try {
                    fileUpload(artImagePath, artFolderPath);
                  } catch (err) {
                    artImageUploadError = err;
                  }
                }
              }

              let query = `UPDATE submission_details SET updated_at=CURRENT_TIMESTAMP`;
              if (art_title != undefined && !lodash.isEmpty(art_title)) {
                query += `, art_title='${art_title}'`;
              }
              if (art_height != undefined && !lodash.isEmpty(art_height)) {
                query += `, height=${art_height}`;
              }
              if (art_width != undefined && !lodash.isEmpty(art_width)) {
                query += `, width='${art_width}'`;
              }
              if (
                art_description != undefined &&
                !lodash.isEmpty(art_description)
              ) {
                query += `, art_description='${art_description}'`;
              }
              if (filename != undefined) {
                query += `, art_file='${filename}'`;
              }

              query += ` WHERE id = ${grant_submitted_id}`;
              // console.log('query: ', query);
              pool.query(query, async (err, result) => {
                // console.log(`insert error: ${err}`);
                // console.log(`insert result: ${result}`);
                if (err) {
                  // console.log(`insert error: ${err}`);
                  res.status(500).send({
                    success: false,
                    message: somethingWentWrong,
                    statusCode: 500,
                  });
                } else {
                  // console.log(`submit req: ${JSON.stringify(req)}`)
                  await getGrantSubmittedDetails(
                    grant_submitted_id,
                    "Grant updated Successfully.",
                    res,
                    req
                  );
                }
              });
            } else {
              res.status(500).send({
                success: false,
                message:
                  "Grant can not be update, its reached to max limit of update.",
                statusCode: 500,
              });
            }
          } else {
            res.status(500).send({
              success: false,
              message: "Grant is not Submitted.",
              statusCode: 500,
            });
            // await getGrantSubmittedDetails(grantAlreadySubmittedResult.rows[0].id, "Grant already submitted.", res, req);
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
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
