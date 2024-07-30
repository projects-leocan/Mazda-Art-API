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
      const finalResult = {
        ...result.rows[0],
        grant_id: result.rows[0].grant_uid,
        transaction_amount: result.rows[0].trasaction_amount,
        transaction_status: result.rows[0].trasaction_status,
        transaction_id: result.rows[0].trasaction_id,
        created_by: await getAdminDetails(result.rows[0].artist_id),
      };
      delete finalResult.grant_uid;
      delete finalResult.trasaction_amount;
      delete finalResult.trasaction_status;
      delete finalResult.trasaction_id;
      delete finalResult.artist_id;

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
            data: finalResult,
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

const getAdminDetails = async (admin_id) => {
  // console.log(`juryData: ${JSON.stringify(juryIds)}`);
  if (admin_id !== undefined) {
    const result = await pool.query(
      `SELECT admin_name FROM admin WHERE admin_id = ${admin_id}`
    );
    console.log("resuly", result.rows[0]);
    return result.rows[0]?.admin_name;
  }
};
