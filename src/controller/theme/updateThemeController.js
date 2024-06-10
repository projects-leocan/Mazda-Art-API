const pool = require("../../config/db");

exports.updateThemeController = async (req, res) => {
  let { theme, admin_id, theme_id } = req.body;

  const currentTime = new Date().toISOString().slice(0, 10);
  const query = `UPDATE theme SET theme='${theme}', updated_at='${currentTime}', updated_by=${admin_id} WHERE id = ${theme_id}`;
  console.log(`query: ${query}`);
  pool.query(query, async (err, result) => {
    // console.log(`err: ${err}`);
    // console.log(`result: ${JSON.stringify(result)}`);
    if (err) {
      console.log(`err: ${err}`);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        statusCode: 500,
      });
    } else {
      const newQuery = `SELECT * FROM theme WHERE id = ${theme_id}`;
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
