const pool = require("../../config/db");

exports.getAdminController = async (req, res) => {
  let { record_per_page, page_no, isAll } = req.query;

  if (record_per_page == undefined) {
    record_per_page = 10;
  }
  if (page_no == undefined) {
    page_no = 1;
  }

  let query = `SELECT *, (SELECT COUNT(*) AS total_count FROM admin) FROM admin ORDER BY is_main_admin DESC, admin_id`;

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
        if (e.total_count != undefined) delete e.total_count;
      });
      res.status(200).send({
        success: true,
        total_count: count,
        message: "Data fetch successfully",
        data: result.rows,
        statusCode: 200,
      });
    }
  });
};
