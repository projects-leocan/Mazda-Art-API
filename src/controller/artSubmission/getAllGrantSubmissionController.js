const pool = require("../../config/db");
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
        ? `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, sd.id, sd.artist_id, sd.grant_id, sd.submited_time, a.fname, a.lname, a.dob, a.gender
        FROM submission_details as sd
        JOIN artist a ON sd.artist_id = a.artist_id order by id`
        : `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, sd.id, sd.grant_id, sd.submited_time
        FROM submission_details as sd
        JOIN artist a ON sd.artist_id = a.artist_id where jury_id=${jury_id} order by id`;

    if (isAll == undefined) {
      const offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    pool.query(query, async (err, result) => {
      // console.log('err: ', err);
      // console.log('result: ', result.rows);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const count = result.rows[0].total_count;
        result.rows.map((e) => {
          delete e.total_count;
        });
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
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
