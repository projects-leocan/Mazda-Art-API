const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getTransactionDetailsController } = require("./getTransactionDetailsController");
const { getTransactionDetails } = require("./getTransactionDetails");

exports.addEnquiryController = async (req, res) => {
    const { id, payment_status, payment_success_date } = req.body;

    try {
        const  query = `UPDATE trasaction_detail SET updated_at=CURRENT_TIMESTAMP`;
        pool.query(query, async (error, result) => {
            console.log(`error: ${error}`);
            console.log(`result: ${result}`);
            if (error) {
                return res.status(500).send(
                    {
                        success: false,
                        message: somethingWentWrong,
                        statusCode: 500
                    }
                )
            } else {
                await getTransactionDetails(id, "Transaction added Successfully.", res)
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
