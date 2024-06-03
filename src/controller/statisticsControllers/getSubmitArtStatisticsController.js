// getSubmitArtStatisticsController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { short_listed, rejected, scholarship_winner, grant_winner, nominated } = require("../../constants/grantConstants");

exports.getSubmitArtStatisticsController = async (req, res) => {
    const { admin_id } = req.query;
    try {

        const query = `SELECT 
        (SELECT COUNT(*) from trasaction_detail WHERE trasaction_status = 'SUCCESS') as total_transaction,
        (SELECT COUNT(*) from submission_details) as total_art_submission,
        (SELECT COUNT(*) from submission_details WHERE status = '${rejected}') as rejected,
        (SELECT COUNT(*) from submission_details WHERE status = '${short_listed}') as short_listed,
        (SELECT COUNT(*) from submission_details WHERE status = '${scholarship_winner}') as scholarship_winner,
        (SELECT COUNT(*) from submission_details WHERE status = '${grant_winner}') as grant_winner,
        (SELECT COUNT(*) from submission_details WHERE status = '${nominated}') as nominated
    `;

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
                // convert data string to int
                const convertedData = result.rows.map(entry => {
                    const convertedEntry = {};
                    for (const value in entry) {
                        if (entry[value] === null) {
                            convertedEntry[value] = 0;
                        } else if (typeof entry[value] === 'string') {
                            convertedEntry[value] = parseInt(entry[value], 10);
                        } else {
                            convertedEntry[value] = entry[value];
                        }
                    }
                    return convertedEntry;
                });
                return res.status(200).send(
                    {
                        success: true,
                        message: "Dashboard Statistics fetch Successfully",
                        statusCode: 200,
                        data: convertedData[0]
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