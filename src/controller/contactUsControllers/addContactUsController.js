const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.addContactUsController = async (req, res) => {
  const { full_name, email, contact_no, message } = req.body;

  try {
    const query = `INSERT INTO contact_us(created_date, full_name, email, contact_no, message)
        VALUES (CURRENT_TIMESTAMP, '${full_name}', '${email}', '${contact_no}', '${message}') RETURNING id`;
    pool.query(query, async (error, result) => {
      // console.log(`error: ${error}`);
      // console.log(`result: ${result}`);
      if (error) {
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        // console.log('result: ', result);
        const id = result.rows[0].id;
        const getQuery = `SELECT * FROM contact_us WHERE id = ${result.rows[0].id}`;
        pool.query(getQuery, async (getError, getResult) => {
          if (getError) {
            return res.status(500).send({
              success: false,
              message: somethingWentWrong,
              statusCode: 500,
            });
          } else {
            return res.status(200).send({
              success: true,
              message: "Contact us added successfully.",
              data: getResult.rows[0],
              statusCode: 200,
            });
          }
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
