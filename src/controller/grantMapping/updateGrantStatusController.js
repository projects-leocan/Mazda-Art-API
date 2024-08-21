//updateGrantStatusController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");
const {
  getGrantSubmittedDetails,
} = require("../artSubmission/getSubmitGrantDetail");
const { sendEmail } = require("../../constants/sendEmail");

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
    // let juryFindQuery = `SELECT * FROM jury WHERE id=${jury_id}`;
    // let juryFindQuery = `SELECT jury_id FROM submission_details WHERE jury_id=${jury_id}`;
    let juryFindQuery = `SELECT jury_id FROM submission_review_details WHERE jury_id=${jury_id} AND artwork_id=${submission_id}`;

    const juryFindResult = await pool.query(juryFindQuery);
    // const juryFind = juryFindQuery.rows[0]
    // console.log("jury", juryFindResult);
    let query;
    if (juryFindResult?.rows.length > 0) {
      // query = `UPDATE submission_details SET status=${status}, jury_id=${jury_id}, star_assigned=${starts}, assign_date=CURRENT_TIMESTAMP`;
      // if (comment != undefined && comment !== "") {
      //   query += `, comment='${comment}'`;
      // }
      // query += ` WHERE artwork_id = ${submission_id} and jury_id=${jury_id}`;

      query = `UPDATE submission_review_details SET status=${status}, star_assigned=${reviewStar}`;
      if (comment != undefined) {
        query += `, comment='${comment}'`;
      }
      query += ` WHERE artwork_id = ${submission_id} and jury_id=${jury_id}`;
    } else {
      // query = `INSERT INTO public.submission_details(
      //   artist_id, transaction_id, grant_id, art_file, art_title, height, width, art_description, submited_time, submission_updated_count, updated_at, status, jury_id, assign_date, comment, star_assigned, artwork_id)
      //   VALUES (${artist_id}, ${transaction_id}, ${grant_id}, '${art_file}', '${art_title}', '${height}', '${width}', '${art_description}', CURRENT_TIMESTAMP, '${submission_updated_count}', CURRENT_TIMESTAMP, ${status}, ${jury_id}, '${assign_date}', '${comment}', ${starts}, ${submission_id});`;
      query = `INSERT INTO public.submission_review_details(
        artwork_id, jury_id, status, comment, star_assigned)
        VALUES (${submission_id}, ${jury_id}, ${status}, '${comment}', '${reviewStar}');`;
    }

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
          sendEmail(
            "Grant request decline",
            `Your grant request has been decline.`,
            artist_email
          );
        } else if (status === "4") {
          //accept mail
          sendEmail(
            "Grant request accepted",
            `Your grant request has been accepted.`,
            artist_email
          );
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
            const prePath = getFileURLPreFixPath(req);

            const finalResponse = {
              ...result.rows[0],
              art_file:
                prePath +
                artistGrantSubmissionFilesPath +
                result.rows[0].art_file,
            };
            delete finalResponse.artist_id;
            delete finalResponse.transaction_id;
            return res.status(200).send({
              success: true,
              statusCode: 200,
              message: "Grant Status Updated Successfully",
              data: finalResponse,
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
