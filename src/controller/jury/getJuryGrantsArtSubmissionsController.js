const pool = require("../../config/db");
const _ = require("lodash");

exports.getJuryGrantsArtSubmissionsController = async (req, res) => {
    const { jury_id, record_per_page, page_no, isAll } = req.query;

    try {
        

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