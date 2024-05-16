const pool = require("../../config/db")

exports.viewUserProfileController = async (req, res) => {
    let { record_per_page, page_no, isAll } = req.query;

    if (record_per_page == undefined) {
        record_per_page = 10;
    }
    if (page_no == undefined) {
        page_no = 1;
    }
    let query = "";
    if (isAll != undefined && isAll) {
        query = `SELECT * FROM artist`;
    } else {
        offset = (page_no - 1) * record_per_page;
        query = `SELECT * FROM artist LIMIT ${record_per_page} OFFSET ${offset}`;
    }

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
                    message: 'Data fetch successfully',
                    data: result.rows,
                    statusCode: 200
                }
            )
        }
    })
}