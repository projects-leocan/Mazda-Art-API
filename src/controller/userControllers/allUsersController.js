const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.allUsersController = async (req, res) => {
    let { record_per_page, page_no, isAll } = req.query;

    try {
        if (record_per_page == undefined) {
            record_per_page = 10;
        }
        if (page_no == undefined) {
            page_no = 1;
        }
        let query;
        // console.log(`isAll: ${isAll}`)
        if (isAll != undefined) {// && isAll === true
            query = `SELECT *, COUNT(*) OVER() AS totalArtist FROM artist`;
        } else {
            offset = (page_no - 1) * record_per_page;
            query = `SELECT *, COUNT(*) OVER() AS totalArtist FROM artist LIMIT ${record_per_page} OFFSET ${offset}`;
        }
        // console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {
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
                        statusCode: 200,
                        message: 'Data fetch successfully',
                        totalArtist: (result.rows.length > 0) ? result.rows[0].totalartist : 0,
                        data: result.rows,
                    }
                )
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