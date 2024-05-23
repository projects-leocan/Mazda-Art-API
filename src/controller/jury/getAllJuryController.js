const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getAllJuryController = async (req, res) => {
    const { admin_id } = req.query;

    try {
        const query = `SELECT jury.id, jury.*, array_agg(jury_links.link) AS links FROM jury LEFT JOIN jury_links ON jury.id = jury_links.jury_id GROUP BY jury.id`;
        pool.query(query, async (err, result) => {
            console.log(`error: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        messages: "Something went wrong",
                        statusCode: 500,
                    }
                )
            } else {
                const finalResponse = [];

                /// remove data from map 
                result.rows.forEach((e) => {
                    delete e.password;
                    delete e.created_at;
                    delete e.created_at;
                    if (Array.isArray(e.links) && e.links.length === 1 && e.links[0] === null) {
                        delete e.links;
                    }
                    const response = {
                        ...e,
                        dob: getUTCdate(e.dob),
                    }
                    finalResponse.push(response);
                })

                return res.status(200).send(
                    {
                        success: true,
                        statusCode: 200,
                        message: "Get all jury successfully",
                        data: finalResponse,
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