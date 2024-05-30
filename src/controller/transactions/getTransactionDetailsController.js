const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getTransactionDetails } = require("./getTransactionDetails");

exports.getTransactionController = async (req, res) => {
    const { transaction_id, } = req.query;

    try {
        await getTransactionDetails(transaction_id, "Transaction Details fetched Successfully.", res)
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
