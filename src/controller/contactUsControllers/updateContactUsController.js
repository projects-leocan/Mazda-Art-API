const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.updateContactUsController = async (req, res) => {
  const { id, status, message_response, email } = req.body;
  const checkEnquiryQuery = `SELECT * FROM contact_us WHERE id=${id}`;
  const checkEnquiryResult = await pool.query(checkEnquiryQuery);
  // console.log(`checkEnquiryResult: ${JSON.stringify(checkEnquiryResult)}`);

  if (lodash.isEmpty(checkEnquiryResult.rows)) {
    return res.status(500).send({
      success: false,
      message: "Contact Us response is not updated",
      statusCode: 500,
    });
  } else {
    let query = `UPDATE contact_us SET response_date=CURRENT_TIMESTAMP`;
    if (message_response != undefined && message_response !== "") {
      query += `, message_response='${message_response}'`;
    }
    if (status != undefined && status !== "") {
      query += `, status='${status}'`;
    }
    query += ` WHERE id = ${id}`;

    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (status === "2") {
          // decline mail
        } else if (status === "3") {
          //accept mail
        }
        const detailQuery = `SELECT * FROM contact_us WHERE id = ${id}`;
        pool.query(detailQuery, (err, result) => {
          // console.log(`err: ${err}`);
          // console.log(`result: ${JSON.stringify(result)}`);
          if (err) {
            return res.status(500).send({
              success: true,
              message: "Contact Us Updated Successfully. can not fetch detail",
              statusCode: 500,
            });
          } else {
            return res.status(200).send({
              success: true,
              statusCode: 200,
              message: "Contact Us Updated Successfully",
              data: result.rows[0],
            });
          }
        });
      }
    });
  }
  try {
    const EnquiryQuery = ``;
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
