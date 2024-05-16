const pool = require("../../config/db")

exports.getAdminController = async (req, res) => {
    const query = `SELECT * FROM admin`;

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