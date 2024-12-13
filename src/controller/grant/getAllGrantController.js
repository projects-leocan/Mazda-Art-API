const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllGrantController = async (req, res) => {
  let { record_per_page, page_no, isAll, artist_id, admin_id } = req.query;

  if (record_per_page == undefined) {
    record_per_page = 10;
  }
  if (page_no == undefined) {
    page_no = 1;
  }

  // let query = `SELECT grant_id, submission_end_date, application_fees, created_at, updated_at, (SELECT COUNT(*) AS total_count FROM grants)
  // from grants
  // ORDER By submission_end_date`;

  let query =
    artist_id === undefined || artist_id === "undefined"
      ? `SELECT 
  g.grant_id, 
  g.grant_uid, 
  g.rank_1_price, 
  g.rank_2_price, 
  g.rank_3_price, 
  g.no_of_nominations,  
  g.venue, 
  g.nominee_price, 
  g.for_each_amount,
  g.grand_amount, 
  g.submission_end_date, 
  g.application_fees, 
  g.created_at,  
  g.updated_at, 
  g.min_height, 
  g.min_width, 
  g.max_height, 
  g.max_width, 
  g.is_flat_pyramid,
  g.no_of_awards,
  ARRAY_AGG(DISTINCT grant_moc.moc_id) AS grant_moc, 
  ARRAY_AGG(DISTINCT grant_theme.theme_id) AS grant_theme,  
  (SELECT COUNT(*) FROM grants) AS total_count
FROM grants g 
LEFT JOIN grant_moc ON g.grant_id = grant_moc.grant_id 
LEFT JOIN grant_theme ON g.grant_id = grant_theme.grant_id 
GROUP BY 
  g.grant_id, 
  g.grant_uid, 
  g.rank_1_price, 
  g.rank_2_price, 
  g.rank_3_price, 
  g.no_of_nominations,  
  g.venue, 
  g.nominee_price, 
  g.for_each_amount,
  g.grand_amount, 
  g.submission_end_date, 
  g.application_fees, 
  g.created_at,  
  g.updated_at, 
  g.min_height, 
  g.min_width, 
  g.max_height, 
  g.max_width
ORDER BY g.grant_id DESC`
      : `SELECT DISTINCT
  g.grant_id, 
  g.grant_uid, 
  g.rank_1_price, 
  g.rank_2_price, 
  g.rank_3_price, 
  g.no_of_nominations,
  g.max_allow_submision,
  g.venue,
  g.nominee_price, 
  g.for_each_amount,
  g.grand_amount, 
  g.submission_end_date, 
  g.application_fees, 
  g.created_at, 
  g.updated_at,
  g.min_height,
  g.min_width,
  g.max_height,
  g.max_width,
  g.is_flat_pyramid,
  g.no_of_awards,
  ARRAY_AGG(DISTINCT grant_moc.moc_id) AS grant_moc, 
  ARRAY_AGG(DISTINCT grant_theme.theme_id) AS grant_theme,  
  sar.status as artwork_status,
  CASE 
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL AND sar.status = 1 THEN 4
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL AND sar.status = 4 THEN 5
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL THEN 3
    WHEN td.artist_id IS NOT NULL AND td.trasaction_status = 'SUCCESS' THEN 2
    ELSE 1
  END AS artist_grant_status
FROM 
  grants g
  LEFT JOIN grant_moc ON g.grant_id = grant_moc.grant_id 
  LEFT JOIN grant_theme ON g.grant_id = grant_theme.grant_id 
  LEFT JOIN trasaction_detail td 
    ON g.grant_id = td.grant_id 
   AND td.artist_id = ${artist_id} 
   AND td.trasaction_status = 'SUCCESS'
  LEFT JOIN submission_details sd 
    ON g.grant_id = sd.grant_id 
   AND sd.artist_id = ${artist_id}
  LEFT JOIN submission_admin_review sar 
    ON sd.id = sar.artwork_id
GROUP BY 
  g.grant_id, 
  g.grant_uid, 
  g.rank_1_price, 
  g.rank_2_price, 
  g.rank_3_price, 
  g.no_of_nominations,
  g.max_allow_submision,
  g.venue,
  g.for_each_amount,
  g.nominee_price, 
  g.grand_amount, 
  g.updated_at,
  g.min_height,
  g.min_width,
  g.submission_end_date, 
  g.application_fees, 
  g.created_at, 
  g.max_height,
  g.max_width,
  sar.status,
  td.artist_id,
  td.trasaction_status,
  sd.id
ORDER BY 
  g.grant_id DESC;
`;

  if (isAll == undefined) {
    offset = (page_no - 1) * record_per_page;
    query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
  }

  // console.log("query get all", query);

  try {
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result:`, result);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const updatedResult = result.rows?.map(async (res) => {
          const grantWinnerStatusQuery = `SELECT sar.status, sar.id, sd.grant_id, sd.artist_id
          FROM submission_admin_review sar
          JOIN submission_details sd ON sar.artwork_id = sd.id
          WHERE sd.grant_id = ${res.grant_id} AND sar.status = 5;`;

          const submitGrantCountQuery = `SELECT COUNT(id) FROM submission_details WHERE grant_id = ${res.grant_id}`;
          const submitGrantCountResult = await pool.query(
            submitGrantCountQuery
          );
          const totalCount = submitGrantCountResult?.rows[0]?.count;

          const grantWinnerStatus = await pool.query(grantWinnerStatusQuery);

          const currentDate = new Date();
          const submissionEndDate = new Date(res.submission_end_date);

          if (admin_id === undefined || admin_id === "undefined") {
            if (
              ((artist_id === undefined || artist_id === "undefined") &&
                submissionEndDate < currentDate) ||
              (submissionEndDate < currentDate && res.artist_grant_status === 1)
            ) {
              return null; // filter out the grant
            }
          }

          return {
            ...res,
            grantWinnerStatus:
              grantWinnerStatus?.rows?.length > 0 ? true : false,
            maxAllowReached:
              totalCount === res.max_allow_submision ? true : false,
            updated_at: getUTCdate(res.updated_at),
            submission_end_date: getUTCdate(res.submission_end_date),
            created_at: getUTCdate(res.created_at),
          };
        });

        updatedResult.map((e) => {
          if (e.total_count != undefined) delete e.total_count;
        });
        const filteredResult = await Promise.all(updatedResult);

        // const [grant_category, grant_themes] = await Promise.all([
        //   !_.isEmpty(result?.rows[0]?.grant_moc) &&
        //   result?.rows[0]?.grant_moc[0] != null
        //     ? getMocData(result?.rows[0]?.grant_moc)
        //     : [],
        //   !_.isEmpty(result?.rows[0]?.grant_theme) &&
        //   result?.rows[0]?.grant_theme[0] != null
        //     ? getThemeData(result?.rows[0]?.grant_theme)
        //     : [],
        // ]);

        const fetchGrantsData = async (grantsArray) => {
          return await Promise.all(
            grantsArray.map(async (grant) => {
              const [grant_category, grant_themes] = await Promise.all([
                !_.isEmpty(grant?.grant_moc) && grant?.grant_moc[0] != null
                  ? getMocData(grant?.grant_moc)
                  : [],
                !_.isEmpty(grant?.grant_theme) && grant?.grant_theme[0] != null
                  ? getThemeData(grant?.grant_theme)
                  : [],
              ]);

              return {
                grant_category,
                grant_themes,
              };
            })
          );
        };

        const filteredGrantResult = await fetchGrantsData(result.rows);

        const appendCategoryAndTheme = (grantsArray, categoryThemeArray) => {
          const filteredData = grantsArray?.filter(
            (results) => results !== null
          );
          return filteredData?.map((grant, index) => {
            // Assuming the order of grantsArray and categoryThemeArray are the same
            const matchingCategoryTheme = categoryThemeArray[index];

            return {
              ...grant, // Spread the original grant object
              grant_category: matchingCategoryTheme?.grant_category || [], // Append grant_category
              grant_themes: matchingCategoryTheme?.grant_themes || [], // Append grant_themes
            };
          });
        };

        const updatedAppendedResult = appendCategoryAndTheme(
          filteredResult,
          filteredGrantResult
        );

        updatedAppendedResult?.map((res) => {
          delete res?.grant_moc, delete res?.grant_theme;
        });

        res.status(200).send({
          success: true,
          message: "Grants fetched successfully",
          total_count: result.rows[0]?.total_count,
          data: updatedAppendedResult,
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
