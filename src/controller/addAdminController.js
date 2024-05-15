const pool = require("../config/db");

exports.addAdminController = async (req, res) => {
    const { admin_name, admin_email, admin_password, admin_contact, admin_address } = req.body;

    const data = [admin_name, admin_email, admin_password, admin_contact, admin_address]
    const query = `INSERT INTO admin (admin_name, admin_email, admin_password, admin_contact, admin_address) VALUES ($1, $2, $3, $4, $5)`
    pool.query(query, data, async (err, result) => {
        // console.log(`err: ${err}`);
        // console.log(`result: ${JSON.stringify(result)}`);
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
                    message: 'Insert Successfully',
                    statusCode: 200
                }
            );
        }
    })
} 