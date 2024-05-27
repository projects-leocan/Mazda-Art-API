const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllGrantController = async (req, res) => {
    let { record_per_page, page_no, isAll } = req.query;

    if (record_per_page == undefined) {
        record_per_page = 10;
    }
    if (page_no == undefined) {
        page_no = 1;
    }

    // let query = `SELECT g.*, m.medium_of_choice, t.theme from public.grants as g, public.medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id ORDER By g.grant_id`;
    // let query = `SELECT g.grant_id, g.submission_end_date, m.medium_of_choice, t.theme from public.grants as g, public.medium_of_choice as m, theme as t where g."category_MOD" = m.id AND g.theme_id = t.id ORDER By g.submission_end_date`;

    let query = `SELECT grant_id, submission_end_date, application_fees from public.grants 
	WHERE submission_end_date >= CURRENT_DATE ORDER By submission_end_date`;

    if (isAll == undefined) {
        offset = (page_no - 1) * record_per_page;
        query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }

    try {
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send({
                    success: false,
                    message: err,
                    statusCode: 500,
                });
            } else {
                const updatedResult = result.rows?.map((res) => {
                    return {
                        ...res,
                        updated_at: getUTCdate(res.updated_at),
                        submission_end_date: getUTCdate(res.submission_end_date),
                        created_at: getUTCdate(res.created_at),
                    };
                });

                // console.log("uopdated at", updatedResult)

                res.status(200).send({
                    success: true,
                    message: "Grants fetched successfully",
                    // data: result.rows,
                    data: updatedResult,
                    statusCode: 200,
                });
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
