const pool = require("../../config/db");
const bcrypt = require("bcrypt")

exports.juryLoginController = async (req, res) => {
    const { email, password } = req.query;

    const query = `SELECT * FROM jury WHERE email='${email}'`
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
            const index = result.rows.findIndex((element) => element.email === email);
            if (index != -1) {
                const dbPassword = result.rows[index].password;
                const isMatch = await bcrypt.compare(password, dbPassword);
                if (isMatch) {
                    if (result.rows[index].password != undefined) delete result.rows[index].password;
                    res.status(200).send(
                        {
                            success: true,
                            message: 'Login Successfully',
                            statusCode: 200,
                            data: result.rows[index],
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