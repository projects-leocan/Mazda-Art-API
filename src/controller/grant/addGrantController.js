const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");


exports.addGrantController = async (req, res) => {
    let { admin_id, category_id, hight, width, theme_id, app_fees, submission_end_date, max_allow_submision, no_of_awards, no_of_nominations, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, is_flat_pyramid } = req.body;
    
    let flat_pyramid = 0;
    if (is_flat_pyramid != undefined && is_flat_pyramid === 1) {
        flat_pyramid = 1;
    }

    const currentTime = new Date().toISOString().slice(0, 10);
    const query = `INSERT INTO grants ("category_MOD", created_by, hight, width, theme_id, application_fees, submission_end_date, max_allow_submision, 
	no_of_awards, no_of_nominations, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, created_at, updated_by, updated_at, is_flat_pyramid) 
    VALUES (${category_id}, ${admin_id}, ${hight}, ${width}, ${theme_id}, ${app_fees}, '${submission_end_date}', ${max_allow_submision}, 
    ${no_of_awards}, ${no_of_nominations}, ${rank_1_price}, ${rank_2_price}, ${rank_3_price}, ${nominee_price}, ${grand_amount}, '${currentTime}', 
    ${admin_id}, '${currentTime}', ${flat_pyramid}) RETURNING grant_id`;

    console.log(`query: ${query}`);

    try {
        const data = await pool.query(query);
        const newQuery = `SELECT g.*, m.medium_of_choice, t.theme from public.grants as g, public.medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id AND g.grant_id = ${data.rows[0].grant_id}`;
        pool.query(newQuery, async (newErr, newResult) => {
            if (newErr) {
                res.status(500).send(
                    {
                        success: false,
                        messages: "Something went wrong",
                        statusCode: 500
                    }
                )
            } else {

                const final_response = {
                    ...newResult.rows[0],
                    updated_at: getUTCdate(newResult.rows[0].updated_at),
                    submission_end_date: getUTCdate(newResult.rows[0].submission_end_date),
                    created_at: getUTCdate(newResult.rows[0].created_at),
                    created_at: getUTCdate(newResult.rows[0].created_at),
                }

                return res.status(200).send(
                    {
                        success: true,
                        message: 'Grant Added Successfully',
                        data: final_response,
                        statusCode: 200
                    }
                );
            }
        })
    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(500).send(
            {
                success: false,
                message: somethingWentWrong,
                statusCode: 500
            }
        )
    }
} 