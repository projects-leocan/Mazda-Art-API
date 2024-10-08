const pool = require("../../config/db");
const lodash = require("lodash");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");

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

  // console.log("query", submissionDetailQuery);
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
              const transactionResultData = {
                ...transactionResult?.rows[0],
                transaction_amount:
                  transactionResult?.rows[0]?.trasaction_amount,
                transaction_id: transactionResult?.rows[0]?.trasaction_id,
                transaction_status:
                  transactionResult?.rows[0]?.trasaction_status,
              };
              delete transactionResultData.trasaction_id;
              delete transactionResultData.trasaction_amount;
              delete transactionResultData.trasaction_status;
              delete transactionResultData.grant_uid;
              // delete transactionResultData.grant_id;

              let finalResponse = {
                ...submissionDetailResult.rows[0],
                grant_id: submissionDetailResult.rows[0].grant_uid,
                grantId: submissionDetailResult.rows[0].grant_id,
                transactionDetail: transactionResultData,
                art_file:
                  prePath +
                  artistGrantSubmissionFilesPath +
                  submissionDetailResult.rows[0].art_file,
              };

              const artistEmailQuery = `SELECT email, fname, lname FROM artist WHERE artist_id=${finalResponse.artist_id}`;

              const artistEmailQueryResult = await pool.query(artistEmailQuery);
              if (jury_id === undefined) {
                finalResponse = {
                  ...finalResponse,
                  artist_name:
                    artistEmailQueryResult?.rows[0]?.fname +
                    " " +
                    artistEmailQueryResult?.rows[0]?.lname,
                  created_by: await getAdminDetails(
                    submissionDetailResult.rows[0].artist_id
                  ),
                };
              } else {
                finalResponse = {
                  ...finalResponse,
                  artist_email: artistEmailQueryResult?.rows[0]?.email,
                };
              }

              if (jury_id !== undefined) {
                // delete finalResponse.artist_id;
                // delete finalResponse.trasaction_id;
                delete finalResponse.jury_id;
                delete finalResponse.transactionDetail;
                delete finalResponse.submited_time;
                delete finalResponse.submission_updated_count;
                delete finalResponse.updated_at;
              }
              delete finalResponse.grant_uid;
              // delete finalResponse.transaction_id;
              delete finalResponse.jury_id;
              delete finalResponse.assign_date;

              res.status(200).send({
                success: true,
                message: message,
                statusCode: 200,
                data: finalResponse,
              });
            } else {
              let finalResponse = {
                ...submissionDetailResult.rows[0],
                grant_id: submissionDetailResult.rows[0].grant_uid,
                grantId: submissionDetailResult.rows[0].grant_id,

                created_by: await getAdminDetails(
                  submissionDetailResult.rows[0].artist_id
                ),
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
                created_by: await getAdminDetails(finalResponse.artist_id),
              };
              if (jury_id !== undefined) {
                // delete finalResponse.artist_id;
                delete finalResponse.payment_init_date;
                delete finalResponse.payment_success_date;
                delete finalResponse.trasaction_amount;
                delete finalResponse.trasaction_status;
                delete finalResponse.trasaction_id;
                delete finalResponse.jury_id;
              }
              delete finalResponse.grant_uid;
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

const getAdminDetails = async (admin_id) => {
  // console.log(`juryData: ${JSON.stringify(juryIds)}`);
  if (admin_id !== undefined) {
    const result = await pool.query(
      `SELECT admin_name FROM admin WHERE admin_id = ${admin_id}`
    );
    return result.rows[0]?.admin_name;
  }
};
