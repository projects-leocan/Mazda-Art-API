const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllGrantController = async (req, res) => {
    const query = `SELECT g.*, m.medium_of_choice, t.theme from public.grants as g, public.medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id ORDER By g.grant_id`;
    try {
        await pool.query('SET TIME ZONE \'UTC\'');
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                // remove category_MOD and theme_id which contains id only
                result.rows.forEach((e) => {
                    delete e.category_MOD;
                    delete e.theme_id;
                })

                const updatedResult = result.rows?.map((res) => {
                    return {
                        ...res,
                        updated_at: getUTCdate(res.updated_at),
                        submission_end_date: getUTCdate(res.submission_end_date),
                        created_at: getUTCdate(res.created_at)
                    }
                })

                // console.log("uopdated at", updatedResult)

                res.status(200).send(
                    {
                        success: true,
                        message: 'Grants fetched successfully',
                        // data: result.rows,
                        data: updatedResult,
                        statusCode: 200
                    }
                )
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