//updateGrantStatusController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const {
  getGrantSubmittedDetails,
} = require("../artSubmission/getSubmitGrantDetail");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");

exports.updateGrantStatusController = async (req, res) => {
  const {
    artist_id,
    transaction_id,
    jury_id,
    status,
    comment,
    submission_id,
    grant_id,
    starts,
    artist_email,
    art_file,
    art_title,
    height,
    width,
    art_description,
    submission_updated_count,
    assign_date,
  } = req.body;
  const checkJuryAssignQuery = `SELECT * FROM grant_assign WHERE grant_id=${grant_id} AND jury_id=${jury_id}`;
  const checkJuryAssignResult = await pool.query(checkJuryAssignQuery);
  // console.log(`checkJuryAssignResult: ${JSON.stringify(checkJuryAssignResult)}`);

  const reviewStar = starts === undefined || starts === "" ? 0 : starts;

  if (lodash.isEmpty(checkJuryAssignResult.rows)) {
    return res.status(500).send({
      success: false,
      message: "Grant is not assign to you as Jury.",
      statusCode: 500,
    });
  } else {
    let juryFindQuery = `SELECT jury_id FROM submission_review_details WHERE jury_id=${jury_id} AND artwork_id=${submission_id}`;

    const juryFindResult = await pool.query(juryFindQuery);

    let query;
    if (juryFindResult?.rows.length > 0) {
      query = `UPDATE submission_review_details SET status=${status}, star_assigned=${reviewStar}`;
      if (comment != undefined) {
        query += `, comment='${comment}'`;
      }
      query += ` WHERE artwork_id = ${submission_id} and jury_id=${jury_id}`;
    } else {
      query = `INSERT INTO public.submission_review_details(
        artwork_id, jury_id, status, comment, star_assigned)
        VALUES (${submission_id}, ${jury_id}, ${status}, '${comment}', '${reviewStar}');`;
    }
    // console.log("query in update", query);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (status === "3") {
          // decline mail
        } else if (status === "4") {
          //accept mail
        }
        const detailQuery = `SELECT * FROM submission_details WHERE artwork_id = ${submission_id}`;
        pool.query(detailQuery, (err, result) => {
          // console.log(`err: ${err}`);
          // console.log(`result: ${JSON.stringify(result)}`);
          if (err) {
            return res.status(500).send({
              success: true,
              message:
                "Grant Status Updated Successfully. can not fetch detail",
              statusCode: 500,
            });
          } else {
            // const prePath = getFileURLPreFixPath(req);

            return res.status(200).send({
              success: true,
              statusCode: 200,
              message: "Grant Status Updated Successfully",
              // data: finalResponse,
            });
          }
        });
      }
    });
  }
  try {
    const juryAssignQuery = ``;
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
