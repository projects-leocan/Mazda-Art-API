const pool = require("../../config/db");
const _ = require("lodash");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getJuryByGrantIdController = async (req, res) => {
    let { grant_id } = req.query;

    const query = `SELECT * FROM jury where id IN (SELECT jury_id FROM grant_assign WHERE grant_id = ${grant_id})`;
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
                res.status(200).send({
                    success: true,
                    message: "Grants fetched successfully",
                    data: result.rows,
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
}