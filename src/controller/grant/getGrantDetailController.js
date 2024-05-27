const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getGrantDetailsController = async (req, res) => {
    let { grant_id } = req.query;

    // let query = `SELECT g.*, m.medium_of_choice, t.theme
    // from grants as g, medium_of_choice as m, theme as t
    // where g."category_MOD" = m.id AND g.theme_id = t.id AND grant_id = ${grant_id}`;

    let query = `SELECT g.*, 
    m.medium_of_choice, 
    t.theme, 
    COALESCE(ARRAY_AGG(ga.jury_id) FILTER (WHERE ga.jury_id IS NOT NULL), '{}') AS jury_ids
FROM public.grants AS g
JOIN public.medium_of_choice AS m ON g."category_MOD" = m.id
JOIN public.theme AS t ON g.theme_id = t.id
LEFT JOIN public.grant_assign AS ga ON g.grant_id = ga.grant_id
WHERE g.grant_id = ${grant_id}
GROUP BY g.grant_id, g.submission_end_date, m.medium_of_choice, t.theme;`;

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
                if (result.rowCount === 0) {
                    res.status(200).send({
                        success: false,
                        message: "Grants not Exist.",
                        statusCode: 200,
                    });
                } else {
                    // let juryData = [];
                    let juryData;
                    // console.log(`result1: ${JSON.stringify(result.rows[0].jury_ids)}`)

                    if (!_.isEmpty(result.rows[0].jury_ids)) {
                        console.log("inside loop !!!!!!!!!!");
                        // result.rows[0].jury_ids.forEach(async (e) => {
                        //     const juryListQuery = `SELECT * FROM jury WHERE id = ${e}`;
                        //     const juryListResult = await pool.query(juryListQuery);
                        //     juryData.push(juryListResult.rows[0]);
                        //     console.log(`juryData1 ${JSON.stringify(juryData)}`);
                        // })

                        juryData = (await pool.query(`SELECT * FROM jury WHERE id = 1716452983279`)).rows[0]


                    } else {
                        console.log("outside loop !!!!!!!!!!");
                    }
                    const updatedResult = {
                        ...result.rows,
                        updated_at: getUTCdate(result.rows.updated_at),
                        submission_end_date: getUTCdate(result.rows.submission_end_date),
                        created_at: getUTCdate(result.rows.created_at),
                        juryList: juryData,
                    };

                    console.log(`juryData2: ${JSON.stringify(juryData)}`);
                    res.status(200).send({
                        success: true,
                        message: "Grants fetched successfully",
                        juryList: juryData,
                        data: updatedResult[0],
                        statusCode: 200,
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
