const pool = require("../../config/db");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllGrantSubmissionController = async (req, res) => {
  try {
    let { jury_id, admin_id, record_per_page, page_no, isAll } = req.query;
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }

    // let query = `SELECT DISTINCT on (grant_id) * FROM submission_details`;
    let query =
      jury_id === undefined
        ? `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, g.grant_uid, sd.artwork_id, sd.artist_id, sd.grant_id, sd.submited_time, sd.art_file, sd.art_title, sd.art_description, sd.height, sd.width, sd.status, a.fname, a.lname, a.dob, a.gender
        FROM submission_details as sd
        JOIN grants g ON sd.grant_id = g.grant_id
        JOIN artist a ON sd.artist_id = a.artist_id order by sd.submited_time DESC`
        : // `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, g.grant_uid, sd.artwork_id, sd.grant_id, sd.submited_time, sd.art_file, sd.art_title, sd.art_description, sd.height, sd.width, sd.status
          // FROM submission_details as sd
          // JOIN grants g ON sd.grant_id = g.grant_id
          // JOIN artist a ON sd.artist_id = a.artist_id where jury_id=${jury_id} order by sd.submited_time DESC`;
          //           `SELECT
          //     (SELECT COUNT(*) FROM submission_details) AS total_count,
          //     g.grant_uid,
          //     sd.artwork_id,
          //     sd.grant_id,
          //     sd.submited_time,
          //     sd.art_file,
          //     sd.art_title,
          //     sd.art_description,
          //     sd.height,
          //     sd.width,
          //     srd.status
          // FROM
          //     submission_details AS sd
          // JOIN
          //     grants g ON sd.grant_id = g.grant_id
          // JOIN
          //     artist a ON sd.artist_id = a.artist_id
          // JOIN
          //     submission_review_details srd ON sd.artwork_id = srd.artwork_id
          // WHERE
          //     sd.jury_id = ${jury_id}
          // ORDER BY
          //     sd.submited_time DESC
          // `
          `select (SELECT COUNT(*) FROM submission_details) AS total_count, g.grant_uid, sb.*, (select status from submission_review_details where jury_id = ${jury_id} AND artwork_id = sb.id) as submission_status from submission_details as sb, grants g
	where g.grant_id = sb.grant_id and sb.jury_id = ${jury_id}`;

    if (isAll == undefined) {
      const offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    console.log("queyr------------", query);

    pool.query(query, async (err, result) => {
      // console.log("err: ", err);
      // console.log("result: ", result.rows);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const prePath = getFileURLPreFixPath(req);

        const count = result?.rows[0]?.total_count;
        result.rows.map((e) => {
          delete e.total_count;
        });
        result.rows.map((row) => {
          row.art_file = `${prePath}${artistGrantSubmissionFilesPath}/${row.art_file}`;
        });
        // const final_result = {
        //   ...result.rows,
        //   art_file:
        //     prePath + artistGrantSubmissionFilesPath + result.rows.art_file,
        // };
        res.status(200).send({
          success: true,
          message: "Get all submissions Successfully.",
          statusCode: 200,
          submission_count: count,
          data: result.rows,
        });
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
