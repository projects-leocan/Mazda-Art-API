const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.searchUserController = async (req, res) => {
    const search_text = req.query.search_text;

    try {
        const query = `SELECT * FROM public.artist WHERE fname LIKE '${search_text}%' or fname LIKE '%${search_text}' or lname LIKE '${search_text}%' or lname LIKE '%${search_text}'`;
        console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                // console.log(`response: ${JSON.stringify(result.rows)}`);
                res.status(200).send(
                    {
                        success: true,
                        message: 'Data fetch successfully',
                        data: result.rows,
                        statusCode: 200
                    }
                )
            }
        })
    } catch (error) {
        res.status(500).send(
            {
                success: true,
                message: somethingWentWrong,
                data: result.rows,
                statusCode: 500
            }
        )
    }

}