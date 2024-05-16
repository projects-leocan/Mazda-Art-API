const pool = require("../config/db");
const jwt = require('jsonwebtoken');
const jwtKeys = require('../constants/jwtKeys');
const { passwordHashing } = require("../constants/passwordHashing");
const bcrypt = require("bcrypt")

exports.adminLoginController = async (req, res) => {
    const { admin_email, admin_password } = req.query;

    const query = `SELECT * FROM admin WHERE admin_email='${admin_email}'`
    pool.query(query, async (err, result) => {
        console.log(`err: ${err}`);
        console.log(`result: ${JSON.stringify(result)}`);
        if (err) {
            res.status(500).send(
                {
                    success: false,
                    messages: "Invalid Credential",
                    statusCode: 500
                }
            )
        } else if (result.rowCount === 0) {
            res.status(500).send(
                {
                    success: false,
                    messages: "Invalid Credential",
                    statusCode: 500
                }
            )
        } else {
            const index = result.rows.findIndex((element) => element.admin_email === admin_email);
            if (index != -1) {
                const dbPassword = result.rows[index].admin_password;
                const isMatch = await bcrypt.compare(admin_password, dbPassword);
                if (isMatch) {
                    let tokenData = {
                        email: admin_email,
                        password: admin_password
                    }
                    let token = jwt.sign({ user: tokenData }, jwtKeys.JWT_SECRET_KEY, { expiresIn: '36500d' }); // 36500 days = 10 Years
                    res.status(200).send(
                        {
                            success: true,
                            token: token,
                            message: 'Login Successfully',
                            statusCode: 200
                        }
                    );
                } else {
                    res.status(500).send(
                        {
                            success: false,
                            messages: "Invalid Password",
                            statusCode: 500
                        }
                    )
                }

            } else {
                res.status(500).send(
                    {
                        success: false,
                        messages: "Invalid Password",
                        statusCode: 500
                    }
                )
            }
        }
    })
} 