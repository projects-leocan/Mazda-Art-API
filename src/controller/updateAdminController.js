const pool = require("../config/db");

exports.updateAdminController = async (req, res) => {
    const { admin_id, admin_name, admin_email, admin_password, admin_contact, admin_address } = req.body;

    const data = [admin_name, admin_email, admin_password, admin_contact, admin_address]
    const query = `UPDATE admin set admin_name=$1, admin_email=$2, admin_password=$3, admin_contact=$4, admin_address=$5 WHERE admin_id=${admin_id}`
    pool.query(query, data, async (err, result) => {
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
                    message: 'Admin Details Updated Successfully',
                    statusCode: 200
                }
            );
        }
    })
} 