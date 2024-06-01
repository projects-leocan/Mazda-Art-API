const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getGrantsForJuryController = async (req, res) => {
    let { jury_id, record_per_page, page_no, isAll } = req.query;
    try {
        if (record_per_page == undefined) {
            record_per_page = 10;
        }
        if (page_no == undefined) {
            page_no = 1;
        }

        let query = `SELECT (SELECT Count(id) as total_count FROM grant_assign WHERE jury_id = ${jury_id}),ga.*, g.* FROM grant_assign as ga JOIN grants g ON g.grant_id = ga.grant_id WHERE jury_id = ${jury_id} ORDER BY id`;
        if (isAll == undefined) {
            offset = (page_no - 1) * record_per_page;
            query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
        }

        pool.query(query, async (err, result) => {
            // console.log(`error: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        messages: somethingWentWrong,
                        statusCode: 500,
                    }
                )
            } else {
                const count = (lodash.isEmpty(result.rows)) ? 0 : result.rows[0].total_count;
                // console.log(`result.rows.: ${JSON.stringify(result.rows)}`);
                result.rows.map((e) => {
                    if (e.total_count != undefined) delete e.total_count
                })
                return res.status(200).send(
                    {
                        success: true,
                        statusCode: 200,
                        totalCount: count,
                        message: "Get all Jury Grants successfully.",
                        data: result.rows,
                    }
                );
            }
        })
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).send(
            {
                success: false,
                message: somethingWentWrong,
                statusCode: 500
            }
        )
    }

}