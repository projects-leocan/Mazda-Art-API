const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.totalGrantController = async (req, res) => {
  let query = `SELECT SUM(grand_amount) AS total_grant_amount FROM grants`;

  try {
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result.rows[0])}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        // console.log("result rows", result.rows[0]);
        res.status(200).send({
          success: true,
          data: result?.rows[0]?.total_grant_amount,
          statusCode: 200,
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
