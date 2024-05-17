const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllMODControllers = async (req, res) => {
    try {
        const query = `SELECT * FROM medium_of_choice ORDER BY id ASC `;
        // console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {
            // console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        messages: err,
                        statusCode: 500
                    }
                )
            } else {
                return res.status(200).send(
                    {
                        success: true,
                        message: 'Medium of Choice Updated Successfully',
                        data: result.rows,
                        statusCode: 200
                    }
                );
            }
        })

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