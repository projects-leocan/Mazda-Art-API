const pool = require("../../config/db");


exports.addGrantController = async (req, res) => {
    let { admin_id, category_id, hight, width, theme_id, app_fees, submission_end_date, max_allow_submision, no_of_awards, no_of_nominations, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount } = req.body;

    const currentTime = new Date().toISOString().slice(0, 10);
    const query = `INSERT INTO grants ("category_MOD", created_by, hight, width, theme_id, application_fees, submission_end_date, max_allow_submision, 
	no_of_awards, no_of_nominations, rank_1_price, rank_2_price, rank_3_price, nominee_price, grand_amount, created_at) 
    VALUES (${category_id}, ${admin_id}, ${hight}, ${width}, ${theme_id}, ${app_fees}, '${submission_end_date}', ${max_allow_submision}, ${no_of_awards}, ${no_of_nominations}, ${rank_1_price}, ${rank_2_price}, ${rank_3_price}, ${nominee_price}, ${grand_amount}, '${currentTime}')`

    console.log(`query: ${query}`);
    try {
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                console.log(`err: ${err}`);
                res.status(500).send(
                    {
                        success: false,
                        messages: "Something went wrong",
                        statusCode: 500
                    }
                )
            } else {
                res.status(200).send(
                    {
                        success: true,
                        message: 'Insert theme Successfully',
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