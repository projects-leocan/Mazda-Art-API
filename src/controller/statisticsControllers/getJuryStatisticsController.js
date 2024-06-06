// getSubmitArtStatisticsController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const {
  short_listed,
  rejected,
  scholarship_winner,
  grant_winner,
  nominated,
  submitted,
  in_review,
} = require("../../constants/grantConstants");

exports.getJuryStatisticsController = async (req, res) => {
  const { admin_id } = req.query;
  try {
    const query = `SELECT id, full_name from jury`;

    pool.query(query, async (err, result) => {
      if (err) {
        console.log(`error: ${err}`);
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        if (lodash.isEmpty(result.rows)) {
          return res.status(200).send({
            success: true,
            message: "Jury Statistics fetch Successfully",
            statusCode: 200,
            data: result.rows,
          });
        } else {
          const getJuryStats = await Promise.all(
            result.rows.map(async (e) => {
              const juryStatsQuery = `SELECT 
                        (SELECT Count(*) from submission_details where jury_id = '${e.id}') as total_grant_assign,
                        (SELECT Count(*) from submission_details where jury_id = '${e.id}' AND (status = '${submitted}' OR status = '${in_review}' )) as total_grant_pending,
                        (SELECT Count(*) from submission_details where jury_id = '${e.id}' AND (status = '${rejected}' OR status = '${short_listed}' OR status = '${scholarship_winner}' OR status = '${grant_winner}' OR status = '${nominated}')) as total_grant_completed`;
              const juryStats = await pool.query(juryStatsQuery);
              return {
                ...juryStats.rows[0],
                jury_id: e.id,
                full_name: e.full_name,
              };
            })
          );
          return res.status(200).send({
            success: true,
            message: "Jury Statistics fetch Successfully",
            statusCode: 200,
            data: getJuryStats,
          });
        }
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
