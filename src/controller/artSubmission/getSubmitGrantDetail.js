const pool = require("../../config/db");
const { getFileURLPreFixPath, artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getGrantSubmittedDetails = async (grant_submit_id, message, res, req) => {
    const submissionDetailQuery = `SELECT * FROM submission_details WHERE id = ${grant_submit_id}`;
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
                const transactionQuery = `SELECT * FROM trasaction_detail WHERE trasaction_id = '${submissionDetailResult.rows[0].transaction_id}'`;
                // console.log(`transactionQuery: ${transactionQuery}`);
                const transactionResult = await pool.query(transactionQuery);
                const prePath = getFileURLPreFixPath(req);
                const finalResponse = {
                    ...submissionDetailResult.rows[0],
                    transactionDetail: transactionResult.rows[0],
                    art_file: prePath + artistGrantSubmissionFilesPath + submissionDetailResult.rows[0].art_file,
                }
                res.status(200).send({
                    success: true,
                    message: message,
                    statusCode: 200,
                    data: finalResponse,
                });
            }
        }
    );
}