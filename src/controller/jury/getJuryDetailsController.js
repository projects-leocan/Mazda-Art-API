const pool = require("../../config/db");
const _ = require("lodash");
const { getJuryDetails } = require("./juryDetail");

exports.getJuryDetailsController = async (req, res) => {
    const { jury_id } = req.query;
    try {
        await getJuryDetails(jury_id, "Get Jury detail successfully", res)
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