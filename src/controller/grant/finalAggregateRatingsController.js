const pool = require("../../config/db");

exports.finalAggregateRatingsController = async (req, res) => {
  let { grant_id } = req.query;

  if (grant_id !== undefined) {
    let query = `SELECT j.id, j.full_name FROM jury j, grant_assign g, grants ga WHERE j.id = g.jury_id AND ga.grant_id = g.grant_id AND g.grant_id = ${grant_id}`;

    pool.query(query, async (err, result) => {
      console.log("query", query);
      console.log("result", result);

      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Grant-Jury-Mapping get successfully.",
          data: result.rows,
        });
      }
    });
  }
};
