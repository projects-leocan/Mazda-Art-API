const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { resolve } = require("../../constants/enquiryStatus");

exports.getAllContactUsController = async (req, res) => {
  let { admin_id, record_per_page, page_no, isAll, status } = req.query;

  try {
    if (status == undefined || lodash.isEmpty(status)) {
      status = resolve;
    }
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT artist_id, fname, lname, dob, gender, email, COUNT(*) OVER() AS totalArtist FROM artist Order by artist_id`;
    let query = `SELECT *, (SELECT count(*) as total_count FROM contact_us WHERE status = '${status}') FROM contact_us WHERE status = '${status}'`;

    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    // console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const count = lodash.isEmpty(result.rows)
          ? 0
          : result.rows[0].total_count;
        if (!lodash.isEmpty(result.rows)) {
          result.rows.map((element) => {
            delete element.total_count;
          });
        }
        return res.status(200).send({
          success: true,
          message: "Get all Contact Us successfully.",
          totalCount: count,
          statusCode: 200,
          data: result.rows,
        });
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
