const pool = require("../../config/db");

exports.getAdminDetailsController = async (req, res) => {
  const { admin_id } = req.query;

  let query = `SELECT * FROM admin where admin_id=${admin_id}`;

  pool.query(query, async (err, result) => {
    // console.log("response-----", result.rows);
    // console.log("error----", err);
    delete result.rows[0].admin_password;
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
        statusCode: 500,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Data fetch successfully",
        data: result.rows[0],
        statusCode: 200,
      });
    }
  });
};
