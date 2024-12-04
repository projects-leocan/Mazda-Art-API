const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");

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
    // submissions,
    eligibilityCriteria,
    juryRules,
    juryCriteria,
  } = req.body;

  // console.log("reqbody", req.body);

  let flat_pyramid = 0;
  if (is_flat_pyramid != undefined && is_flat_pyramid === 1) {
    flat_pyramid = 1;
  }
  const jury_criteria = juryCriteria
    ?.replace(/\+/g, "") // Remove all '+' signs
    .replace(/\n/g, "\\n"); // Replace actual newlines with '\n'

  const jury_rules = juryRules?.replace(/\+/g, "").replace(/\n/g, "\\n");

  const eligibility_criteria = eligibilityCriteria
    ?.replace(/\+/g, "")
    .replace(/\n/g, "\\n");

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

  // const query = `INSERT INTO grants ("grant_uid", created_by, max_height, max_width, min_height, min_width, venue, application_fees, submission_end_date, submission_evaluation_start, submission_evaluation_end, result_date, max_allow_submision,
  // no_of_awards,know_more, no_of_nominations, for_each_amount, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, created_at, updated_by, updated_at, is_flat_pyramid) VALUES ('${grant_uid}', ${admin_id}, ${max_height}, ${max_width}, ${min_height}, ${min_width}, '${venue}', ${app_fees}, '${submission_end_date}', '${submission_evaluation_start}', '${submission_evaluation_end}', '${result_date}', ${max_allow_submision},
  //   ${no_of_awards}, '${knowMore}', ${no_of_nominations}, ${for_each_amount}, ${rank_1_price}, ${rank_2_price}, ${rank_3_price}, ${nominee_price}, ${grand_amount}, CURRENT_TIMESTAMP,
  //   ${admin_id}, CURRENT_TIMESTAMP, ${flat_pyramid}) RETURNING grant_id`;

  const query = `INSERT INTO grants ("grant_uid", created_by, max_height, max_width, min_height, min_width, venue, application_fees, submission_end_date, submission_evaluation_start, submission_evaluation_end, result_date, max_allow_submision,
  no_of_awards, no_of_nominations, for_each_amount, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, eligibility_criteria, jury_rules, jury_criteria, created_at, updated_by, updated_at, is_flat_pyramid) VALUES ('${grant_uid}', ${admin_id}, ${max_height}, ${max_width}, ${min_height}, ${min_width}, '${venue}', ${app_fees}, '${submission_end_date}', '${submission_evaluation_start}', '${submission_evaluation_end}', '${result_date}', ${max_allow_submision}, 
    ${no_of_awards}, ${no_of_nominations}, ${for_each_amount}, ${rank_1_price}, ${rank_2_price}, ${rank_3_price}, ${nominee_price}, ${grand_amount}, '${eligibility_criteria}', '${jury_rules}', '${jury_criteria}', CURRENT_TIMESTAMP,
    ${admin_id}, CURRENT_TIMESTAMP, ${flat_pyramid}) RETURNING grant_id`;

  // console.log("query", query);

  try {
    await pool.query(query, async (err, result) => {
      if (err) {
        // console.log("new rr", err);
        // console.log("result rows", result?.rows);

        res.status(500).send({
          success: false,
          // message: "Something went wrong",
          message: err,
          statusCode: 500,
        });
      } else {
        if (!lodash.isEmpty(category_id)) {
          // Parse the JSON string into an array of objects

          const categoryArray = category_id;

          // Construct the values string for the INSERT query
          let values = categoryArray
            .map((e) => `(${result?.rows[0]?.grant_id}, ${e.value})`)
            .join(", ");
          // Construct the INSERT query
          let mocInsertQuery = `INSERT INTO grant_moc(grant_id, moc_id) VALUES ${values}`;

          // Execute the INSERT query
          // console.log("moc query", mocInsertQuery);
          const mocInsertResult = await pool.query(mocInsertQuery);
        }

        if (!lodash.isEmpty(theme_id)) {
          // Parse the JSON string into an array of objects

          const categoryArray = theme_id;

          // Construct the values string for the INSERT query
          let values = categoryArray
            .map((e) => `(${result?.rows[0]?.grant_id}, ${e.value})`)
            .join(", ");
          // Construct the INSERT query
          let mocInsertQuery = `INSERT INTO grant_theme(grant_id, theme_id) VALUES ${values}`;

          // Execute the INSERT query
          const mocInsertResult = await pool.query(mocInsertQuery);
        }

        // if (!lodash.isEmpty(submissions)) {
        //   // Parse the JSON string into an array of objects

        //   const submissionsArray = submissions;

        //   // Construct the values string for the INSERT query
        //   let values = submissionsArray
        //     .map(
        //       (e) =>
        //         `(${result?.rows[0]?.grant_id}, ${e.no_of_submission}, ${e.app_fee})`
        //     )
        //     .join(", ");
        //   // Construct the INSERT query
        //   let insertQuery = `INSERT INTO total_artwork_submission(grant_id, no_of_submission, application_fee) VALUES ${values}`;
        //   // console.log("insertQuery", insertQuery);

        //   // Execute the INSERT query
        //   const mocInsertResult = await pool.query(insertQuery);
        // }

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
      // message: somethingWentWrong,
      message: error,
      statusCode: 500,
    });
  }
};
