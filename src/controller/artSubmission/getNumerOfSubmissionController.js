const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getNumberOfSubmissionController = async (req, res) => {
  let { artist_id, grant_id } = req.query;

  try {
    if (artist_id === undefined || grant_id === undefined) {
      return res.status(400).send({
        success: false,
        message:
          artist_id === undefined
            ? "Artist ID is required"
            : "Grant ID is required",
        statusCode: 400,
      });
    } else {
      const query = `SELECT no_of_submission FROM trasaction_detail WHERE artist_id=${artist_id} AND grant_id=${grant_id} AND trasaction_status = 'SUCCESS'`;

      console.log("query", query);

      pool.query(query, async (err, result) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        } else {
          const data = result?.rows[0];
          console.log("data", result);
          const numberOfSubmission = data?.no_of_submission;
          return res.status(200).send({
            success: true,
            message: "Number of submission retrieved successfully",
            statusCode: 200,
            data: numberOfSubmission,
          });
        }
      });
    }
  } catch (error) {
    // console.log(`error: ${error}`);

    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
