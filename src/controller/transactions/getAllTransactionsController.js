const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getTransactionDetails } = require("./getTransactionDetails");

exports.getAllTransactionsController = async (req, res) => {
  let { admin_id, jury_id, record_per_page, page_no, isAll, status } =
    req.query;

  // console.log("status", status);

  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT * FROM trasaction_detail`;
    // let query = `SELECT (SELECT COUNT(*) FROM trasaction_detail) AS total_count, td.*, a.fname, a.lname, a.dob, a.gender
    //     FROM trasaction_detail as td
    //     JOIN artist a ON td.artist_id = a.artist_id order by td.payment_success_date DESC`;
    //   let query = `
    //   SELECT
    //     (SELECT COUNT(*) FROM trasaction_detail) AS total_count,
    //     td.*,
    //     g.grant_uid,
    //     a.fname,
    //     a.lname,
    //     a.email,
    //     a.mobile_number,
    //     a.dob,
    //     a.gender
    //   FROM
    //     trasaction_detail td
    //   JOIN
    //     artist a ON td.artist_id = a.artist_id
    //   JOIN
    //     grants g ON td.grant_id = g.grant_id
    //   ORDER BY
    //     td.payment_success_date DESC
    // `;

    let query = `SELECT`;

    if (status === "undefined" || status === "isAll") {
      // console.log("status inside", status);
      query += ` (SELECT COUNT(*) FROM trasaction_detail) AS total_count,`;
    } else {
      query += ` (SELECT COUNT(*) FROM trasaction_detail WHERE trasaction_status = ${
        status === "success" ? "'SUCCESS'" : "'FAILED'"
      } ) AS total_count,`;
    }

    query += ` td.*, 
    g.grant_uid, 
    g.submission_end_date,
    a.fname, 
    a.lname, 
    a.email,
    a.mobile_number,
    a.dob, 
    a.gender,
    (SELECT Max(sd.submited_time) 
     FROM submission_details sd 
     WHERE sd.transaction_id::bigint = td.id) AS submission_date_time`;

    query += ` FROM 
      trasaction_detail td
JOIN 
      artist a ON td.artist_id = a.artist_id
JOIN 
      grants g ON td.grant_id = g.grant_id
`;

    if (status === "success") {
      query += ` AND td.trasaction_status = 'SUCCESS'`;
    }

    if (status === "failed") {
      query += `AND td.trasaction_status = 'FAILED'`;
    }

    query += ` ORDER BY 
      td.payment_success_date DESC`;

    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }

    // console.log("query", query);

    pool.query(query, async (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const count = result.rows[0]?.total_count;

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
