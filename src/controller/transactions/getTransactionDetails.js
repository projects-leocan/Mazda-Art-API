const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.getTransactionDetails = async (transaction_id, message, res) => {
  try {
    // const query = `SELECT td.*, g.grant_uid FROM trasaction_detail JOIN
    //   grants g ON td.grant_id = g.grant_id WHERE id = ${transaction_id}`;
    const query = `
      SELECT 
        td.*, 
        g.grant_uid 
      FROM 
        trasaction_detail td
      JOIN 
        grants g ON td.grant_id = g.grant_id 
      WHERE 
        td.id = $1;
    `;
    pool.query(query, [transaction_id], async (error, result) => {
      // console.log('error: ', error);
      console.log("result: ", result);
      if (error) {
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (lodash.isEmpty(result.rows)) {
          return res.status(500).send({
            success: false,
            statusCode: 500,
            message: "Transaction details not found.",
          });
        } else {
          return res.status(200).send({
            success: true,
            statusCode: 200,
            message: message,
            data: result.rows[0],
          });
        }
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
