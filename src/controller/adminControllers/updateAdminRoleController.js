const { somethingWentWrong } = require("../../constants/messages");
const pool = require("../../config/db");
const _ = require("lodash");

exports.updateAdminRoleController = async (req, res) => {
  try {
    let { admin_id, role, role_is_updated } = req.body;

    console.log("req body", req.body);

    // if (role_is_updated !== undefined) {
    //

    if (!_.isEmpty(role)) {
      // Parse the JSON string into an array of objects
      //   const roleArray = JSON.parse(role);
      let deleteQuery = `DELETE FROM admin_role WHERE admin_id = ${admin_id}`;
      const deleteResult = await pool.query(deleteQuery);
      const roleArray = role;
      console.log("roleArray", roleArray);
      // Construct the values string for the INSERT query
      let values = roleArray.map((e) => `(${admin_id}, ${e.id})`).join(", ");

      // Construct the INSERT query
      let roleInsertQuery = `INSERT INTO admin_role(admin_id, role) VALUES ${values}`;

      // Execute the INSERT query
      pool.query(roleInsertQuery, async (err, result) => {
        console.log("err in update role", err);
        console.log("update role result", result);

        if (err) {
          res.status(500).send({
            success: false,
            message: err,
            statusCode: 500,
          });
        } else {
          res.status(200).send({
            success: true,
            message: "Role Selected Successfully",
            statusCode: 200,
          });
        }
      });
    } else {
      let deleteQuery = `DELETE FROM admin_role WHERE admin_id = ${admin_id}`;
      await pool.query(deleteQuery, async (err, result) => {
        console.log("err in update role", err);
        console.log("update role result", result);

        if (err) {
          res.status(500).send({
            success: false,
            message: err,
            statusCode: 500,
          });
        } else {
          res.status(200).send({
            success: true,
            message: "All Role Unselected Successfully",
            statusCode: 200,
          });
        }
      });
    }
    // }
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
