const { somethingWentWrong } = require("../../constants/messages");
const pool = require("../../config/db");

exports.getAdminRoleController = async (req, res) => {
  try {
    const { admin_id } = req.query;
    let query = `SELECT role FROM admin_role where admin_id=${admin_id}`;
    pool.query(query, async (err, result) => {
      //   console.log("response-----", result.rows);
      //   console.log("error----", err);
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
          data: result.rows,
          statusCode: 200,
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
