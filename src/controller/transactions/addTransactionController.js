const pool = require("../../config/db");
const _ = require("lodash");

const { somethingWentWrong } = require("../../constants/messages");
const {
  getTransactionDetailsController,
} = require("./getTransactionDetailsController");
const { getTransactionDetails } = require("./getTransactionDetails");
const { v4: uuidv4 } = require("uuid");

exports.addTransactionController = async (req, res) => {
  const {
    artist_id,
    grant_id,
    // transaction_id,
    // payment_init_date,
    // payment_status,
    transaction_amount,
    // payment_success_date,
  } = req.body;
  const uuid = uuidv4();
  const currentTime = new Date();
  const threeMinutesAgo = new Date(currentTime.getTime() - 3 * 60 * 1000);

  try {
    const query = `INSERT INTO trasaction_detail(
        artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date)
        VALUES (${artist_id}, ${grant_id}, '${uuid}', '${threeMinutesAgo.toISOString()}', 'SUCCESS', '${transaction_amount}', '${currentTime.toISOString()}') RETURNING id`;

    // console.log("query", query);

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
        await getTransactionDetails(
          result.rows[0].id,
          "Payment Successful!",
          res
        );
      }
    });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
