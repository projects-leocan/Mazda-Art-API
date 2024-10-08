const pool = require("../../config/db");
const { passwordHashing } = require("../../constants/passwordHashing");

exports.updateAdminController = async (req, res) => {
  const {
    admin_id,
    admin_name,
    admin_email,
    admin_contact,
    admin_address,
    admin_password,
  } = req.body;

  // console.log(`req.body: ${JSON.stringify(req.body)}`);

  // const data = [admin_name, admin_email, admin_contact, admin_address]
  // const query = `UPDATE admin set admin_name=$1, admin_email=$2, admin_contact=$4, admin_address=$5 WHERE admin_id=${admin_id}`
  let query = `UPDATE admin set updated_at=CURRENT_TIMESTAMP`;

  if (admin_name != undefined && admin_name != "") {
    query += `, admin_name='${admin_name}'`;
  }
  if (admin_email != undefined && admin_email != "") {
    query += `, admin_email='${admin_email}'`;
  }
  if (admin_contact != undefined && admin_contact != "") {
    const checkQuery = `SELECT * FROM admin WHERE admin_contact = $1`;
    const values = [admin_contact];
    const contactUsResult = await pool.query(checkQuery, values);

    if (contactUsResult.rows.length > 0) {
      return res.status(400).send({
        success: false,
        message: "Contact number already exists, try a different number.",
        statusCode: 400,
      });
    } else {
      query += `, admin_contact=${admin_contact}`;
    }
  }
  if (admin_address != undefined && admin_address != "") {
    query += `, admin_address='${admin_address}'`;
  }
  if (admin_password != undefined && admin_password != "") {
    const hashedPassword = await passwordHashing(admin_password);
    query += `, admin_password='${hashedPassword}'`;
  }
  query += ` WHERE admin_id=${admin_id}`;
  // console.log("query: ", query);
  pool.query(query, async (err, result) => {
    // console.log(`err: ${err}`);
    // console.log(`result: ${JSON.stringify(result)}`);
    if (err) {
      if (err.detail === `Key (admin_email)=(${admin_email}) already exists.`) {
        res.status(400).send({
          success: false,
          message: "Email Id already Exist, try different email or sign in.",
          statusCode: 400,
        });
      } else {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      }
    } else {
      const newQuery = `SELECT * FROM admin WHERE admin_id = ${admin_id}`;
      pool.query(newQuery, async (newErr, newResult) => {
        if (newErr) {
          res.status(500).send({
            success: false,
            message: "Something went wrong",
            statusCode: 500,
          });
        } else {
          return res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Admin Details Updated Successfully",
            data: newResult.rows[0],
          });
        }
      });
    }
  });
};
