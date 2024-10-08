const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.updateMODController = async (req, res) => {
  const { mod_id, mod_value, admin_id } = req.body;
  try {
    const currentTimeInMilliseconds = new Date().toISOString().slice(0, 10);
    const query = `UPDATE medium_of_choice SET medium_of_choice='${mod_value}', updated_by=${admin_id}, updated_at=CURRENT_TIMESTAMP WHERE id = '${mod_id}';`;
    // console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const newQuery = `SELECT * FROM medium_of_choice WHERE id = ${mod_id}`;
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
              message: "MOD Added Successfully",
              data: newResult.rows[0],
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
