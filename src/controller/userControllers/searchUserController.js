const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.searchUserController = async (req, res) => {
    const search_text = req.query.search_text;

    try {
        // search by name 
        // const query = `SELECT * FROM artist WHERE fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;

        // search by contact number
        // const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}'
        
        // search by name and contact number
        const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}' or fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;
        console.log(`search query: ${query}`);
        pool.query(query, async (err, result) => {
            // console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
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