const pool = require("../../config/db");
const moment = require('moment-timezone');
const { passwordHashing } = require("../../constants/passwordHashing");


exports.addAdminController = async (req, res) => {
    const { admin_name, admin_email, admin_password, admin_contact, admin_address, timezone } = req.body;

    const hashedPassword = await passwordHashing(admin_password);
    // console.log(`hashedPassword: ${hashedPassword}`);
    if (hashedPassword === "Error in hashing") {
        res.status(500).send(
            {
                success: false,
                messages: "Error in hashing",
            }
        )
    }
    if (timezone == undefined || timezone === "") {
        timezone = "Asia/Manila";
    }
    const currentTime = moment().tz(timezone);
    const formattedTime = currentTime.format('YYYY-MM-DD HH:mm:ss');
    console.log(`formattedTime: ${formattedTime}`);

    const data = [admin_name, admin_email, hashedPassword, admin_contact, admin_address, formattedTime]
    const query = `INSERT INTO admin (admin_name, admin_email, admin_password, admin_contact, admin_address, created_at) VALUES ($1, $2, $3, $4, $5, $6)`
    pool.query(query, data, async (err, result) => {
        // console.log(`err: ${err}`);
        // console.log(`result: ${JSON.stringify(result)}`);
        if (err) {
            console.log(`err: ${err}`);
            res.status(500).send(
                {
                    success: false,
                    messages: "Something went wrong",
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