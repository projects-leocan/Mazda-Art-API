//updateGrantStatusController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");
const { sendEmail } = require("../../constants/sendEmail");

exports.updateAdminArtworkStatusController = async (req, res) => {
  const { admin_id, status, comment, submission_id, starts, artist_email } =
    req.body;
  console.log("req.body", req.body);
  const reviewStar = starts === undefined || starts === "" ? "0" : starts;

  let juryFindQuery = `SELECT artwork_id FROM submission_admin_review WHERE artwork_id=${submission_id}`;

  const juryFindResult = await pool.query(juryFindQuery);
  let query;
  if (juryFindResult?.rows.length > 0) {
    query = `UPDATE submission_admin_review SET status=${status}, star_assigned=${reviewStar}`;
    if (comment != undefined && comment !== "") {
      query += `, comment='${comment}'`;
    }
    query += ` WHERE artwork_id = ${submission_id}`;
  } else {
    query = `INSERT INTO submission_admin_review(
        artwork_id, admin_id, status, comment, star_assigned)
        VALUES (${submission_id}, ${admin_id}, ${status}, '${comment}', '${starts}');`;
  }
  pool.query(query, async (err, result) => {
    if (err) {
      // console.log("err", err);
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
};
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