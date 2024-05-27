const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getGrantDetailsController = async (req, res) => {
    let { grant_id } = req.query;

    let query = `SELECT g.grant_id, g.submission_end_date, m.medium_of_choice, t.theme from public.grants as g, public.medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id ORDER By g.submission_end_date`;

    //     let query = `SELECT g.grant_id, g.submission_end_date, g.application_fees, 
    //     g.submission_end_date, 
    //     m.medium_of_choice, 
    //     t.theme, 
    //     ARRAY_AGG(ga.jury_id) AS jury_ids
    // FROM public.grants AS g
    // JOIN public.medium_of_choice AS m ON g."category_MOD" = m.id
    // JOIN public.theme AS t ON g.theme_id = t.id
    // JOIN public.grant_assign AS ga ON g.grant_id = ga.grant_id
    // WHERE g.grant_id = ${grant_id}
    // GROUP BY g.grant_id, g.submission_end_date, m.medium_of_choice, t.theme;`;

    try {
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
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
                        ...result.rows,
                        updated_at: getUTCdate(result.rows.updated_at),
                        submission_end_date: getUTCdate(result.rows.submission_end_date),
                        created_at: getUTCdate(result.rows.created_at),
                    };

                    res.status(200).send({
                        success: true,
                        message: "Grants fetched successfully",
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
