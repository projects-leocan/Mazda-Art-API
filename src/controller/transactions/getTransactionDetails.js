const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.getTransactionDetails = async (transaction_id, message, res) => {

    try {
        const query = `SELECT * FROM trasaction_detail WHERE id = ${transaction_id}`;
        pool.query(query, async (error, result) => {
            if (error) {
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
                        statusCode: 200,
                        message: message,
                        data: result.rows[0]
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
