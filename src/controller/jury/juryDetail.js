const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getJuryDetails = async (jury_id, message, res) => {
    const newQuery = `SELECT jury.id, jury.*, array_agg(jury_links.link) AS links FROM jury LEFT JOIN jury_links ON jury.id = jury_links.jury_id 
	WHERE jury_id = ${jury_id} GROUP BY jury.id`;
    try {
        pool.query(newQuery, async (newErr, newResult) => {
            if (newErr) {
                res.status(500).send(
                    {
                        success: false,
                        messages: "Something went wrong",
                        statusCode: 500,
                    }
                )
            } else {
                /// remove data from map 
                delete newResult.rows[0].password;
                delete newResult.rows[0].created_at;
                delete newResult.rows[0].created_at;
                const response = {
                    ...newResult.rows[0],
                    dob: getUTCdate(newResult.rows[0].dob),
                }
                return res.status(200).send(
                    {
                        success: true,
                        statusCode: 200,
                        message: message,
                        data: response,
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