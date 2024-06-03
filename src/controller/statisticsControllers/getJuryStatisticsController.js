// getSubmitArtStatisticsController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { short_listed, rejected, scholarship_winner, grant_winner, nominated } = require("../../constants/grantConstants");

exports.getJuryStatisticsController = async (req, res) => {
    const { admin_id } = req.query;
    try {

        const query = ``;

        pool.query(query, async (err, result) => {
            if (err) {
                console.log(`error: ${err}`);
                return res.status(500).send(
                    {
                        success: false,
                        message: somethingWentWrong,
                        statusCode: 500
                    }
                )
            } else {
                return res.status(200).send(
                    {
                        success: true,
                        message: "Dashboard Statistics fetch Successfully",
                        statusCode: 200,
                        data: result.rows
                    }
                )
            }
        });
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