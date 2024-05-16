const pool = require("../../config/db");

exports.deleteAdminController = async (req, res) => {
    const { admin_id } = req.body;

    const query = `DELETE FROM admin WHERE admin_id = ${admin_id}`
    pool.query(query, async (err, result) => {
        console.log(`err: ${err}`);
        console.log(`result: ${JSON.stringify(result)}`);
        if (err) {
            res.status(500).send(
                {
                    success: false,
                    messages: err,
                    statusCode: 500
                }
            )
        } else {
            res.status(200).send(
                {
                    success: true,
                    message: 'Admin Deleted Successfully',
                    statusCode: 200
                }
            );
        }
    })
} 