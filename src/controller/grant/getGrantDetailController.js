const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getGrantDetailsController = async (req, res) => {
  let { grant_id } = req.query;

  let query = `SELECT g.*, 
        ARRAY_AGG(DISTINCT grant_moc.moc_id) AS grant_moc,
        ARRAY_AGG(DISTINCT grant_theme.theme_id) AS grant_theme, 
        COALESCE(ARRAY_AGG(ga.jury_id) FILTER (WHERE ga.jury_id IS NOT NULL), '{}') AS jury_ids
    FROM grants AS g
    LEFT JOIN grant_moc ON g.grant_id = grant_moc.grant_id
    LEFT JOIN grant_theme ON g.grant_id = grant_theme.grant_id
    LEFT JOIN grant_assign AS ga ON g.grant_id = ga.grant_id
    WHERE g.grant_id = ${grant_id}
    GROUP BY g.grant_id, g.submission_end_date;`;
  console.log("qery", query);
  try {
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      console.log(`result:`, result?.rows);
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
          // const grant_category_data = await Promise.all([
          //   !_.isEmpty(result?.rows[0]?.grant_moc) &&
          //   result?.rows[0]?.grant_moc[0] != null
          //     ? getMocData(result?.rows[0]?.grant_moc)
          //     : [],
          // ]);

          const [grant_category, grant_themes] = await Promise.all([
            !_.isEmpty(result?.rows[0]?.grant_moc) &&
            result?.rows[0]?.grant_moc[0] != null
              ? getMocData(result?.rows[0]?.grant_moc)
              : [],
            !_.isEmpty(result?.rows[0]?.grant_theme) &&
            result?.rows[0]?.grant_theme[0] != null
              ? getThemeData(result?.rows[0]?.grant_theme)
              : [],
          ]);

          // console.log("moc_category", grant_category);
          // console.log("grant_theme", grant_themes);

          const updatedResult = {
            ...result.rows[0],
            grant_id: result.rows[0].grant_uid,
            updated_at: getUTCdate(result.rows[0].updated_at),
            submission_end_date: getUTCdate(result.rows[0].submission_end_date),
            created_at: getUTCdate(result.rows[0].created_at),
            juryList: await getJuryDetails(result.rows[0].jury_ids),
            created_by: await getAdminDetails(result.rows[0].created_by),
            grant_category,
            grant_themes,
          };

          // console.log(`updatedResult: ${JSON.stringify(updatedResult)}`);
          delete updatedResult.jury_ids;
          delete updatedResult.id;
          delete updatedResult.grant_uid;
          delete updatedResult.grant_moc;
          delete updatedResult.grant_theme;

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
    // console.log("resuly", result.rows[0]);
    return result.rows[0]?.admin_name;
  }
};

const getMocData = async (list) => {
  return await Promise.all(
    list.map(async (e) => {
      const mocResult = await pool.query(
        `SELECT id, medium_of_choice FROM medium_of_choice WHERE id = $1`,
        [e]
      );
      return mocResult.rows[0];
    })
  );
};

const getThemeData = async (list) => {
  return await Promise.all(
    list.map(async (e) => {
      const themeResult = await pool.query(
        `SELECT id, theme FROM theme WHERE id = $1`,
        [e]
      );
      return themeResult.rows[0];
    })
  );
};
