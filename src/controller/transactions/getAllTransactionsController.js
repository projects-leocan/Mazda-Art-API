const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getTransactionDetails } = require("./getTransactionDetails");

exports.getAllTransactionsController = async (req, res) => {
  let { admin_id, jury_id, record_per_page, page_no, isAll } = req.query;

  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT * FROM trasaction_detail`;
    let query = `SELECT (SELECT COUNT(*) FROM trasaction_detail) AS total_count, td.*, a.fname, a.lname, a.dob, a.gender
        FROM trasaction_detail as td
        JOIN artist a ON td.artist_id = a.artist_id order by td.payment_success_date DESC`;
    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }

    pool.query(query, async (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const count = result.rows[0].total_count;

        result.rows.map((e) => {
          delete e.total_count;
        });
        res.status(200).send({
          success: true,
          message: "Transactions fetched successfully.",
          statusCode: 200,
          transactions_count: count,
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
