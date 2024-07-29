const pool = require("../../config/db");
const lodash = require("lodash");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getGrantSubmittedDetails = async (
  grant_submit_id,
  jury_id,
  message,
  res,
  req
) => {
  // const submissionDetailQuery = `SELECT * FROM submission_details WHERE id = ${grant_submit_id}`;
  const submissionDetailQuery = `
  SELECT 
    sd.*, 
    g.grant_uid 
  FROM 
    submission_details sd
  JOIN 
    grants g ON sd.grant_id = g.grant_id 
  WHERE 
    sd.id = ${grant_submit_id};
`;
  try {
    pool.query(
      submissionDetailQuery,
      async (submissionDetailError, submissionDetailResult) => {
        if (submissionDetailError) {
          res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        } else {
          // console.log(
          //   `submissionDetailResult: ${JSON.stringify(submissionDetailResult)}`
          // );
          const prePath = getFileURLPreFixPath(req);

          if (!lodash.isEmpty(submissionDetailResult.rows)) {
            if (submissionDetailResult.rows[0].transaction_id != undefined) {
              const transactionQuery = `SELECT * FROM trasaction_detail WHERE id = '${submissionDetailResult.rows[0].transaction_id}'`;
              // console.log(`transactionQuery: ${transactionQuery}`);
              const transactionResult = await pool.query(transactionQuery);
              let finalResponse = {
                ...submissionDetailResult.rows[0],
                // grant_id: submissionDetailResult.rows[0].grant_uid,
                transactionDetail: transactionResult.rows[0],
                art_file:
                  prePath +
                  artistGrantSubmissionFilesPath +
                  submissionDetailResult.rows[0].art_file,
              };

              const artistEmailQuery = `SELECT email FROM artist WHERE artist_id=${finalResponse.artist_id}`;
              const artistEmailQueryResult = await pool.query(artistEmailQuery);
              finalResponse = {
                ...finalResponse,
                artist_email: artistEmailQueryResult.rows[0].email,
              };

              if (jury_id !== undefined) {
                delete finalResponse.artist_id;
                delete finalResponse.transaction_id;
                delete finalResponse.jury_id;
                delete finalResponse.transactionDetail;
                delete finalResponse.submited_time;
                delete finalResponse.submission_updated_count;
                delete finalResponse.updated_at;
              }
              // delete finalResponse.grant_uid;
              res.status(200).send({
                success: true,
                message: message,
                statusCode: 200,
                data: finalResponse,
              });
            } else {
              let finalResponse = {
                ...submissionDetailResult.rows[0],
                // grant_id: submissionDetailResult.rows[0].grant_uid,
                art_file:
                  prePath +
                  artistGrantSubmissionFilesPath +
                  submissionDetailResult.rows[0].art_file,
              };
              const artistEmailQuery = `SELECT email FROM artist WHERE artist_id=${finalResponse.artist_id}`;
              const artistEmailQueryResult = await pool.query(artistEmailQuery);
              finalResponse = {
                ...finalResponse,
                artist_email: artistEmailQueryResult.rows[0].email,
              };
              if (jury_id !== undefined) {
                delete finalResponse.artist_id;
                delete finalResponse.payment_init_date;
                delete finalResponse.payment_success_date;
                delete finalResponse.trasaction_amount;
                delete finalResponse.trasaction_status;
                delete finalResponse.transaction_id;
              }
              // delete finalResponse.grant_uid;
              res.status(200).send({
                success: true,
                message: message,
                statusCode: 200,
                data: finalResponse,
              });
            }
          } else {
            res.status(500).send({
              success: false,
              message: "Grant submission detail not found",
              statusCode: 500,
            });
          }
        }
      }
    );
  } catch (error) {
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
