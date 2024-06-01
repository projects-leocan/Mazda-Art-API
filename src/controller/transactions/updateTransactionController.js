const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { getTransactionDetailsController } = require("./getTransactionDetailsController");
const { getTransactionDetails } = require("./getTransactionDetails");

exports.updateTransactionController = async (req, res) => {
    const { id, payment_status, payment_success_date } = req.body;

    try {
        let query = `UPDATE trasaction_detail SET updated_at=CURRENT_TIMESTAMP`;
        if (payment_status != undefined) {
            query += `, trasaction_status='${payment_status}'`;
        }
        if (payment_success_date != undefined) {
            query += `, payment_success_date='${payment_success_date}'`;
        }
        query += ` WHERE id = ${id}`;
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
