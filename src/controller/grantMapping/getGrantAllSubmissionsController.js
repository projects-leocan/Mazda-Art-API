const pool = require("../../config/db");
const _ = require("lodash");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");

exports.getGrantAllSubmissionsController = async (req, res) => {
  let { grant_id, jury_id, admin_id } = req.query;

  try {
    // const isJuryAssignQuery = `SELECT * FROM grant_assign WHERE grant_id=${grant_id} AND jury_id=${jury_id}`;
    // const isJuryAssignResult = await pool.query(isJuryAssignQuery);
    // console.log('isJuryAssignResult: ', isJuryAssignResult);
    // if (lodash.isEmpty(isJuryAssignResult.rows)) {
    //     return res.status(500).send({
    //         success: false,
    //         statusCode: 500,
    //         message: "Grant is not assign to you.",
    //     });
    // } else {
    // const query = `SELECT * FROM submission_details WHERE grant_id = ${grant_id} ORDER BY id DESC`;
    // const query = `
    //   SELECT
    //     sd.*,
    //     g.grant_uid
    //   FROM
    //     submission_details sd
    //   JOIN
    //     grants g ON sd.grant_id = g.grant_id
    //   WHERE
    //     sd.grant_id = ${grant_id}
    //   ORDER BY
    //     sd.artwork_id DESC;
    // `;
    //   let query = `SELECT sd.*, g.grant_uid FROM
    //   submission_details AS sd
    //   JOIN
    //   grants g ON sd.grant_id = g.grant_id
    //  WHERE
    //   sd.grant_id = ${grant_id}`;

    // let query = `select g.grant_uid, sb.* from submission_details as sb, grants g
    // where g.grant_id = sb.grant_id and sb.grant_id = ${grant_id}`;

    //   if (jury_id !== undefined) {
    //     query += ` AND sb.jury_id = ${jury_id}`;
    //   }

    //   let query = `select g.grant_uid, sb.*, (select status from submission_review_details where jury_id = 59 ) as submission_status from submission_details as sb, grants g
    // where g.grant_id = sb.grant_id and sb.grant_id = ${grant_id} AND sb.jury_id = 59`;

    let query = `select g.grant_uid, sb.*, sb.id as submission_id`;

    if (jury_id !== undefined) {
      query += `, (select status from submission_review_details where jury_id = ${jury_id} AND artwork_id = sb.id) as submission_status`;
    }

    query += ` from submission_details as sb, grants g
	where g.grant_id = sb.grant_id and sb.grant_id = ${grant_id}`;

    //   if (jury_id !== undefined) {
    //     query += ` AND sb.jury_id = ${jury_id}`;
    //   }

    query += ` ORDER BY sb.artwork_id DESC`;

    // console.log("query", query);

    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);

      result?.rows?.map((row) => {
        delete row.artwork_id;
        row.artwork_id = row.submission_id;
        delete row.submission_id;
      });

      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        if (lodash.isEmpty(result.rows)) {
          res.status(200).send({
            success: true,
            message: "Grants fetched successfully",
            data: [],
            statusCode: 200,
          });
        } else {
          const path = getFileURLPreFixPath(req);
          //   let finalResponse = result.rows.map((e) => {
          //     return {
          //       ...e,
          //       art_file: `${path}${artistGrantSubmissionFilesPath}${e.art_file}`,
          //     };
          //   });
          let finalResponse = await Promise.all(
            result.rows.map(async (e) => {
              const emailQuery = `SELECT email FROM artist WHERE artist_id = ${e.artist_id}`;
              const emailResult = await pool.query(emailQuery);
              const email = emailResult.rows[0]
                ? emailResult.rows[0].email
                : null;

              return {
                ...e,
                art_file: `${path}${artistGrantSubmissionFilesPath}${e.art_file}`,
                artist_email: email,
              };
            })
          );

          finalResponse.map((e) => {
            delete e.artist_id;
            delete e.transaction_id;
          });
          res.status(200).send({
            success: true,
            message: "Grants submissions fetch successfully.",
            data: finalResponse,
            statusCode: 200,
          });
        }
      }
    });
    // }
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
