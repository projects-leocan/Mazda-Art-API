const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");

exports.addGrantController = async (req, res) => {
  let {
    admin_id,
    category_id,
    max_height,
    max_width,
    min_height,
    min_width,
    venue,
    theme_id,
    app_fees,
    submission_end_date,
    max_allow_submision,
    knowMore,
    no_of_awards,
    no_of_nominations,
    for_each_amount,
    rank_1_price,
    rank_2_price,
    rank_3_price,
    nominee_price,
    grand_amount,
    is_flat_pyramid,
    submission_evaluation_start,
    submission_evaluation_end,
    result_date,
  } = req.body;

  let flat_pyramid = 0;
  if (is_flat_pyramid != undefined && is_flat_pyramid === 1) {
    flat_pyramid = 1;
  }

  const generateGrantUid = async () => {
    try {
      // const result = await pool.query(`SELECT max(grant_id) as id FROM grants`);
      const result = await pool.query(
        `SELECT grant_uid FROM grants WHERE grant_id = (SELECT MAX(grant_id) FROM grants);`
      );
      let latestUid = result.rows[0]?.grant_uid || "HAF-SGA-0000A-2024";
      let latestNumber = parseInt(latestUid.split("-")[2], 10);

      let newNumber = latestNumber + 1;
      let newUid = `HAF-SGA-${newNumber}A-2024`; // Adjusted formatting
      return newUid;
    } catch (err) {
      // console.error("Error generating grant_uid:", err);
      throw new Error(somethingWentWrong);
    }
  };

  const grant_uid = await generateGrantUid();

  const currentTime = new Date().toISOString().slice(0, 10);

  const query = `INSERT INTO grants ("grant_uid" ,"category_MOD", created_by, max_height, max_width, min_height, min_width, venue, theme_id, application_fees, submission_end_date, submission_evaluation_start, submission_evaluation_end, result_date, max_allow_submision, 
	no_of_awards,know_more, no_of_nominations, for_each_amount, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, created_at, updated_by, updated_at, is_flat_pyramid) VALUES ('${grant_uid}' ,${category_id}, ${admin_id}, ${max_height}, ${max_width}, ${min_height}, ${min_width}, '${venue}', ${theme_id}, ${app_fees}, '${submission_end_date}', '${submission_evaluation_start}', '${submission_evaluation_end}', '${result_date}', ${max_allow_submision}, 
    ${no_of_awards}, '${knowMore}', ${no_of_nominations}, ${for_each_amount}, ${rank_1_price}, ${rank_2_price}, ${rank_3_price}, ${nominee_price}, ${grand_amount}, CURRENT_TIMESTAMP, 
    ${admin_id}, CURRENT_TIMESTAMP, ${flat_pyramid}) RETURNING grant_id`;

  console.log("query", query);

  try {
    await pool.query(query, async (err, result) => {
      if (err) {
        // console.log("new rr", err);
        res.status(500).send({
          success: false,
          message: "Something went wrong",
          statusCode: 500,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "Grant Added Successfully",
          data: [],
          statusCode: 200,
        });
      }
    });
    //   // console.log("data rows", data.rows);
    //   // const newQuery = `SELECT g.*, m.medium_of_choice, t.theme from grants as g, medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id AND g.grant_id = ${data.rows[0].grant_id}`;
    //   // pool.query(newQuery, async (newErr, newResult) => {
    //   //   console.log("new resul", newResult);
    //   //   if (newErr) {
    //   //     console.log("new rr", newErr);
    //   //     res.status(500).send({
    //   //       success: false,
    //   //       message: "Something went wrong",
    //   //       statusCode: 500,
    //   //     });
    //   //   } else {
    //   //     const final_response = {
    //   //       ...newResult.rows[0],
    //   //       updated_at: getUTCdate(newResult.rows[0].updated_at),
    //   //       submission_end_date: getUTCdate(
    //   //         newResult.rows[0].submission_end_date
    //   //       ),
    //   //       created_at: getUTCdate(newResult.rows[0].created_at),
    //   //       created_at: getUTCdate(newResult.rows[0].created_at),
    //   //     };
    //   //     console.log("final_response", final_response);

    //   //     return res.status(200).send({
    //   //       success: true,
    //   //       message: "Grant Added Successfully",
    //   //       data: final_response,
    //   //       statusCode: 200,
    //   //     });
    //   //   }
    //   // });
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
