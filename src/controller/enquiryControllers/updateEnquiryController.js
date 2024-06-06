const { sendEmail } = require("../../constants/sendEmail");
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.updateEnquiryController = async (req, res) => {
  const { enquiry_id, status, response, email } = req.body;
  const checkEnquiryQuery = `SELECT * FROM enquiries WHERE id=${enquiry_id}`;
  const checkEnquiryResult = await pool.query(checkEnquiryQuery);
  // console.log(`checkEnquiryResult: ${JSON.stringify(checkEnquiryResult)}`);

  if (lodash.isEmpty(checkEnquiryResult.rows)) {
    return res.status(500).send({
      success: false,
      message: "Enquiry response is not updated",
      statusCode: 500,
    });
  } else {
    let query = `UPDATE enquiries SET resolve_date=CURRENT_TIMESTAMP`;
    if (response != undefined && response !== "") {
      query += `, query_response='${response}'`;
    }
    if (status != undefined && status !== "") {
      query += `, status='${status}'`;
    }
    query += ` WHERE id = ${enquiry_id}`;

    pool.query(query, async (err, result) => {
      //   console.log(`err: ${err}`);
      //   console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (status === "2") {
          // decline mail
          sendEmail(
            "Enquiry resolved",
            `Your enquiry has been resolved.`,
            email
          );
        } else if (status === "3") {
          //accept mail
          sendEmail(
            "Enquiry decline",
            `Your enquiry request has been decline.`,
            email
          );
        }
        const detailQuery = `SELECT * FROM enquiries WHERE id = ${enquiry_id}`;
        pool.query(detailQuery, (err, result) => {
          // console.log(`err: ${err}`);
          // console.log(`result: ${JSON.stringify(result)}`);
          if (err) {
            return res.status(500).send({
              success: true,
              message: "Enquiry Updated Successfully. can not fetch detail",
              statusCode: 500,
            });
          } else {
            return res.status(200).send({
              success: true,
              statusCode: 200,
              message: "Enquiry Updated Successfully",
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
