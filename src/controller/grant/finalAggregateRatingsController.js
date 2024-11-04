const pool = require("../../config/db");

exports.finalAggregateRatingsController = async (req, res) => {
  let { grant_id, artwork_id } = req.query;
  // console.log("req ", req.query);

  if (grant_id !== undefined) {
    let query = `SELECT jd.*, sd.*, jury.full_name, submission_details.art_title FROM 
    (SELECT jury_id FROM grant_assign WHERE grant_id=${grant_id}) AS jd
    LEFT JOIN (SELECT * FROM submission_review_details WHERE artwork_id = ${artwork_id}) AS sd
    ON sd.jury_id = jd.jury_id
    LEFT JOIN jury
    ON jury.id = jd.jury_id
    LEFT JOIN submission_details
    ON submission_details.id = sd.artwork_id;`;

    pool.query(query, async (err, result) => {
      // console.log("query", query);
      // console.log("result", result);

      if (err) {
        // console.log("err in final ", err);
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
