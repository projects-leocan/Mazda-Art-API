const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllGrantController = async (req, res) => {
  let { record_per_page, page_no, isAll, artist_id } = req.query;

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
      ? `SELECT grant_id, grant_uid, rank_1_price, rank_2_price, rank_3_price, no_of_nominations, venue, nominee_price, grand_amount, submission_end_date, application_fees, created_at, updated_at, (SELECT COUNT(*) AS total_count FROM grants) 
	from grants 
	ORDER By grant_id DESC`
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
  g.grand_amount, 
  g.submission_end_date, 
  g.application_fees, 
  g.created_at, 
  g.updated_at,
  sar.status as artwork_status,
  CASE 
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL AND sar.status = 1 THEN 4
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL AND sar.status = 4 THEN 5
    WHEN td.artist_id IS NOT NULL AND sd.id IS NOT NULL THEN 3
    WHEN td.artist_id IS NOT NULL THEN 2
    ELSE 1
  END AS artist_grant_status
FROM 
  grants g
  LEFT JOIN trasaction_detail td ON g.grant_id = td.grant_id AND td.artist_id = ${artist_id}
  LEFT JOIN submission_details sd ON g.grant_id = sd.grant_id AND sd.artist_id = ${artist_id}
  LEFT JOIN submission_admin_review sar ON sd.id = sar.artwork_id
ORDER BY 
  g.grant_id DESC;
`;

  if (isAll == undefined) {
    offset = (page_no - 1) * record_per_page;
    query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
  }
  // console.log("get all grant query", query);
  try {
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
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
          const totalCount = submitGrantCountResult?.rows[0];

          const grantWinnerStatus = await pool.query(grantWinnerStatusQuery);
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
        res.status(200).send({
          success: true,
          message: "Grants fetched successfully",
          total_count: result.rows[0]?.total_count,
          data: await Promise.all(updatedResult),
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
