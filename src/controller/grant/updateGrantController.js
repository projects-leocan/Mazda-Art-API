const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const lodash = require("lodash");
exports.updateGrantController = async (req, res) => {
  let {
    grant_id,
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
    result_date,
    submission_evaluation_start,
    submission_evaluation_end,
    max_allow_submision,
    no_of_awards,
    knowMore,
    no_of_nominations,
    for_each_amount,
    rank_1_price,
    rank_2_price,
    rank_3_price,
    nominee_price,
    grand_amount,
    is_flat_pyramid,
    is_theme_update,
    is_moc_update,
    eligibilityCriteria,
    juryRules,
    juryCriteria,
  } = req.body;

  // console.log("req . body", req.body);

  const jury_criteria = juryCriteria
    ?.replace(/\+/g, "") // Remove all '+' signs
    .replace(/\n/g, "\\n"); // Replace actual newlines with '\n'

  const jury_rules = juryRules?.replace(/\+/g, "").replace(/\n/g, "\\n");

  const eligibility_criteria = eligibilityCriteria
    ?.replace(/\+/g, "")
    .replace(/\n/g, "\\n");

  const currentTime = new Date().toISOString().slice(0, 10);
  let query = `UPDATE grants set `;

  query += `updated_at=CURRENT_TIMESTAMP`;
  if (admin_id != undefined) {
    query += `, updated_by='${admin_id}'`;
  }
  if (max_height != undefined) {
    query += `, max_height='${max_height}'`;
  }
  // if (category_id != undefined) {
  //   query += `, "category_MOD"='${category_id}'`;
  // }
  if (max_width != undefined) {
    query += `, max_width='${max_width}'`;
  }
  if (min_height != undefined) {
    query += `, min_height='${min_height}'`;
  }
  if (min_width != undefined) {
    query += `, min_width='${min_width}'`;
  }
  if (venue !== undefined) {
    query += `, venue='${venue}'`;
  }
  // if (theme_id != undefined) {
  //   query += `, theme_id='${theme_id}'`;
  // }
  if (app_fees != undefined) {
    query += `, application_fees='${app_fees}'`;
  }
  if (submission_end_date != undefined) {
    query += `, submission_end_date='${submission_end_date}'`;
  }
  if (submission_evaluation_start != undefined) {
    query += `, submission_evaluation_start='${submission_evaluation_start}'`;
  }
  if (submission_evaluation_end != undefined) {
    query += `, submission_evaluation_end='${submission_evaluation_end}'`;
  }
  if (result_date !== undefined) {
    query += `, result_date='${result_date}'`;
  }
  if (max_allow_submision != undefined) {
    query += `, max_allow_submision='${max_allow_submision}'`;
  }
  if (no_of_awards != undefined) {
    query += `, no_of_awards='${no_of_awards}'`;
  }
  if (knowMore != undefined) {
    query += `, know_more='${knowMore}'`;
  }
  if (no_of_nominations != undefined) {
    query += `, no_of_nominations='${no_of_nominations}'`;
  }
  if (is_flat_pyramid == 1) {
    query += `, rank_1_price=0, rank_2_price=0, rank_3_price=0`;
    if (for_each_amount !== undefined) {
      query += `, for_each_amount='${for_each_amount}'`;
    }
  } else {
    query += `, for_each_amount=0`;
    if (rank_1_price != undefined) {
      query += `, rank_1_price='${rank_1_price}'`;
    }
    if (rank_2_price != undefined) {
      query += `, rank_2_price='${rank_2_price}'`;
    }
    if (rank_3_price != undefined) {
      query += `, rank_3_price='${rank_3_price}'`;
    }
  }
  if (nominee_price != undefined) {
    query += `, nominee_price='${nominee_price}'`;
  }
  if (grand_amount != undefined) {
    query += `, grand_amount='${grand_amount}'`;
  }

  if (eligibilityCriteria !== undefined) {
    query += `, eligibility_criteria='${eligibility_criteria}'`;
  }

  if (juryRules !== undefined) {
    query += `, jury_rules='${jury_rules}'`;
  }

  if (juryCriteria !== undefined) {
    query += `, jury_criteria='${jury_criteria}'`;
  }

  if (is_flat_pyramid != undefined) {
    query += `, is_flat_pyramid='${is_flat_pyramid}'`;
  }

  if (is_moc_update !== undefined) {
    let deleteQuery = `DELETE FROM grant_moc WHERE grant_id = ${grant_id}`;
    const deleteResult = await pool.query(deleteQuery);

    if (!lodash.isEmpty(category_id)) {
      // Parse the JSON string into an array of objects

      const mocsArray = category_id;

      // Construct the values string for the INSERT query
      let values = mocsArray.map((e) => `(${grant_id}, ${e.value})`).join(", ");
      // Construct the INSERT query
      let mocInsertQuery = `INSERT INTO grant_moc(grant_id, moc_id) VALUES ${values}`;

      // Execute the INSERT query
      const mocInsertResult = await pool.query(mocInsertQuery);
    }
  }

  if (is_theme_update !== undefined) {
    let deleteQuery = `DELETE FROM grant_theme WHERE grant_id = ${grant_id}`;
    const deleteResult = await pool.query(deleteQuery);

    if (!lodash.isEmpty(theme_id)) {
      // Parse the JSON string into an array of objects

      const mocsArray = theme_id;

      // Construct the values string for the INSERT query
      let values = mocsArray.map((e) => `(${grant_id}, ${e.value})`).join(", ");
      // Construct the INSERT query
      let mocInsertQuery = `INSERT INTO grant_theme(grant_id, theme_id) VALUES ${values}`;

      // Execute the INSERT query
      const mocInsertResult = await pool.query(mocInsertQuery);
    }
  }

  query += ` WHERE grant_id='${grant_id}'`;
  // console.log(`query: ${query}`);
  try {
    pool.query(query, async (err, result) => {
      // console.log(`err update Grant: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        // console.log(`err: ${err}`);
        res.status(500).send({
          success: false,
          message: "Something went wrong",
          statusCode: 500,
        });
      } else {
        // await pool.query(`SET TIME ZONE 'UTC'`);
        const newQuery = `SELECT g.*, m.medium_of_choice, t.theme from grants as g, medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id AND g.grant_id = ${grant_id}`;
        pool.query(newQuery, async (newErr, newResult) => {
          if (newErr) {
            res.status(500).send({
              success: false,
              message: "Something went wrong",
              statusCode: 500,
            });
          } else {
            const final_response = {
              ...newResult.rows[0],
              updated_at: getUTCdate(newResult?.rows[0]?.updated_at),
              submission_end_date: getUTCdate(
                newResult?.rows[0]?.submission_end_date
              ),
              created_at: getUTCdate(newResult?.rows[0]?.created_at),
              created_at: getUTCdate(newResult?.rows[0]?.created_at),
            };

            return res.status(200).send({
              success: true,
              message: "Insert theme Successfully",
              data: final_response,
              statusCode: 200,
            });
          }
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
