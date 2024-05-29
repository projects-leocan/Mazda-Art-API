const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllGrantSubmissionController = async (res, req) => {
    try{
        const { jury_id, admin_id } = req.query;
        
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
        });
    }
}