const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllJuryController = async (req, res) => {
  let { admin_id, record_per_page, page_no, isAll } = req.query;

  if (record_per_page == undefined) {
    record_per_page = 10;
  }
  if (page_no == undefined) {
    page_no = 1;
  }

  let query = `SELECT jury.id, jury.full_name, jury.email ,jury.contact_no ,jury.designation, array_agg(jury_links.link) AS links, 
	(SELECT COUNT(*) AS total_count FROM jury)
	FROM jury LEFT JOIN jury_links ON jury.id = jury_links.jury_id GROUP BY jury.id`;
  if (isAll == undefined) {
    offset = (page_no - 1) * record_per_page;
    query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
  }

  try {
    pool.query(query, async (err, result) => {
      // console.log(`error: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const count = result.rows[0].total_count;
        // console.log(`result.rows.: ${JSON.stringify(result.rows)}`);
        result.rows.map((e) => {
          if (e.total_count != undefined) delete e.total_count;
        });
        return res.status(200).send({
          success: true,
          statusCode: 200,
          totalCount: count,
          message: "Get all jury successfully",
          data: result.rows,
        });
      }
    });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
