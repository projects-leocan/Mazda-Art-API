const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getGrantDetailsController = async (req, res) => {
  let { grant_id } = req.query;

  let query = `SELECT g.*, 
        m.medium_of_choice, 
        t.theme, 
        COALESCE(ARRAY_AGG(ga.jury_id) FILTER (WHERE ga.jury_id IS NOT NULL), '{}') AS jury_ids
    FROM grants AS g
    JOIN medium_of_choice AS m ON g."category_MOD" = m.id
    JOIN theme AS t ON g.theme_id = t.id
    LEFT JOIN grant_assign AS ga ON g.grant_id = ga.grant_id
    WHERE g.grant_id = ${grant_id}
    GROUP BY g.grant_id, g.submission_end_date, m.medium_of_choice, t.theme;`;

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
        if (result.rowCount === 0) {
          res.status(200).send({
            success: false,
            message: "Grants not Exist.",
            statusCode: 200,
          });
        } else {
          const updatedResult = {
            ...result.rows[0],
            grant_id: result.rows[0].grant_uid,
            updated_at: getUTCdate(result.rows[0].updated_at),
            submission_end_date: getUTCdate(result.rows[0].submission_end_date),
            created_at: getUTCdate(result.rows[0].created_at),
            juryList: await getJuryDetails(result.rows[0].jury_ids),
            created_by: await getAdminDetails(result.rows[0].created_by),
          };

          // console.log(`updatedResult: ${JSON.stringify(updatedResult)}`);
          delete updatedResult.jury_ids;
          delete updatedResult.id;
          delete updatedResult.grant_uid;
          res.status(200).send({
            success: true,
            message: "Grants fetched successfully",
            data: updatedResult,
            statusCode: 200,
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

const getJuryDetails = async (juryIds) => {
  // console.log(`juryData: ${JSON.stringify(juryIds)}`);

  if (!_.isEmpty(juryIds)) {
    const juryData = await Promise.all(
      juryIds.map(async (e) => {
        const result = await pool.query(
          `SELECT id, full_name, email, contact_no, address, designation, dob, about, created_at FROM jury WHERE id = ${e}`
        );
        return result.rows[0];
      })
    );

    return juryData.filter((jury) => jury !== undefined);
  } else {
    return [];
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
