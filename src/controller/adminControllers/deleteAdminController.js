const pool = require("../../config/db");

exports.deleteAdminController = async (req, res) => {
  const { admin_id } = req.body;

  // check whether admin is main admin
  const isMainAdmin = await pool.query(
    `SELECT is_main_admin FROM admin WHERE admin_id = ${admin_id}`
  );
  // console.log(`isMainAdmin.rows[0].is_main_admin: ${isMainAdmin.rows[0].is_main_admin}`);
  if (isMainAdmin.rows[0].is_main_admin === 1) {
    res.status(200).send({
      success: false,
      message: "Main Admin can not be Deleted.",
      statusCode: 200,
    });
  } else {
    const query = `DELETE FROM admin WHERE admin_id = ${admin_id}`;
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Admin Deleted Successfully",
          deletedId: admin_id,
          statusCode: 200,
        });
      }
    });
  }
};
