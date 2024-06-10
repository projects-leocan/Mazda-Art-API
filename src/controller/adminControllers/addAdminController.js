const pool = require("../../config/db");
const moment = require("moment-timezone");
const { passwordHashing } = require("../../constants/passwordHashing");

exports.addAdminController = async (req, res) => {
  let {
    admin_name,
    admin_email,
    admin_password,
    admin_contact,
    admin_address,
    timezone,
  } = req.body;

  try {
    const hashedPassword = await passwordHashing(admin_password);
    // console.log(`hashedPassword: ${hashedPassword}`);
    if (hashedPassword === "Error in hashing") {
      res.status(500).send({
        success: false,
        message: "Error in hashing",
      });
    }
    if (timezone == undefined || timezone === "") {
      timezone = "Asia/Manila";
    }
    const currentTime = moment().tz(timezone);
    const formattedTime = currentTime.format("YYYY-MM-DD HH:mm:ss");
    console.log(`formattedTime: ${formattedTime}`);

    const data = [
      admin_name,
      admin_email,
      hashedPassword,
      admin_contact,
      admin_address,
      formattedTime,
    ];
    const query = `INSERT INTO admin (admin_name, admin_email, admin_password, admin_contact, admin_address, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING admin_id`;
    pool.query(query, data, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        console.log(`err: ${err}`);
        if (
          err.detail === `Key (admin_email)=(${admin_email}) already exists.`
        ) {
          res.status(500).send({
            success: false,
            message: "Email Id already Exist, try different email or sign in.",
            statusCode: 500,
          });
        } else {
          console.log(`err: ${err}`);
          res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        }
      } else {
        const newQuery = `SELECT * FROM admin WHERE admin_id = ${result.rows[0].admin_id}`;
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
              message: "Insert Admin Successfully",
              data: newResult.rows[0],
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};
