//updateGrantStatusController
const pool = require("../../config/db");
const lodash = require('lodash');
const { somethingWentWrong } = require("../../constants/messages");
const { getFileURLPreFixPath, artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { getGrantSubmittedDetails } = require("../artSubmission/getSubmitGrantDetail");
const { sendEmail } = require("../../constants/sendEmail");

exports.updateGrantStatusController = async (req, res) => {
    const { jury_id, status, comment, submission_id, grant_id, starts, artist_email } = req.body;
    const checkJuryAssignQuery = `SELECT * FROM grant_assign WHERE grant_id=${grant_id} AND jury_id=${jury_id}`;
    const checkJuryAssignResult = await pool.query(checkJuryAssignQuery);
    // console.log(`checkJuryAssignResult: ${JSON.stringify(checkJuryAssignResult)}`);

    if (lodash.isEmpty(checkJuryAssignResult.rows)) {
        return res.status(500).send({
            success: false,
            message: "Grant is not assign to you as Jury.",
            statusCode: 500,
        });
    } else {
        let query = `UPDATE submission_details SET status=${status}, jury_id=${jury_id}, star_assigned=${starts}, assign_date=CURRENT_TIMESTAMP`;
        if (comment != undefined && comment !== "") {
            query += `, comment='${comment}'`;
        }
        query += ` WHERE id = ${submission_id}`;

        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send({
                    success: false,
                    message: somethingWentWrong,
                    statusCode: 500,
                });
            } else {
                if (status === '3') {
                    // decline mail
                    sendEmail('Grant request decline', `Your grant request has been decline.`, artist_email);
                } else if (status === '4') {
                    //accept mail
                    sendEmail('Grant request accepted', `Your grant request has been accepted.`, artist_email);
                }
                const detailQuery = `SELECT * FROM submission_details WHERE id = ${submission_id}`;
                pool.query(detailQuery, (err, result) => {
                    // console.log(`err: ${err}`);
                    // console.log(`result: ${JSON.stringify(result)}`);
                    if (err) {
                        return res.status(500).send({
                            success: true,
                            message: "Grant Status Updated Successfully. can not fetch detail",
                            statusCode: 500,
                        });
                    } else {
                        const prePath = getFileURLPreFixPath(req);

                        const finalResponse = {
                            ...result.rows[0],
                            art_file: prePath + artistGrantSubmissionFilesPath + result.rows[0].art_file,
                        }
                        delete finalResponse.artist_id
                        delete finalResponse.transaction_id
                        return res.status(200).send({
                            success: true,
                            statusCode: 200,
                            message: "Grant Status Updated Successfully",
                            data: finalResponse
                        });
                    }
                });
            }
        });
    }
    try {
        const juryAssignQuery = ``;
    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
        });
    }
}