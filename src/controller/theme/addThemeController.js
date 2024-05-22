const pool = require("../../config/db");


exports.addThemeController = async (req, res) => {
    let { theme, admin_id } = req.body;

    const currentTime = new Date().toISOString().slice(0, 10);
    const query = `INSERT INTO theme (theme, created_at, updated_at, created_by, updated_by) VALUES ('${theme}', '${currentTime}', '${currentTime}', ${admin_id}, ${admin_id}) RETURNING id`
    console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
        console.log(`err: ${err}`);
        console.log(`result: ${JSON.stringify(result)}`);
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
            const newQuery = `SELECT * FROM theme WHERE id = ${result.rows[0].id}`;
            pool.query(newQuery, async (newErr, newResult) => {
                if (newErr) {
                    res.status(500).send(
                        {
                            success: false,
                            messages: "Something went wrong",
                            statusCode: 500,
                        }
                    )
                } else {
                    return res.status(200).send(
                        {
                            success: true,
                            statusCode: 200,
                            message: 'Admin Details Updated Successfully',
                            data: newResult.rows[0],
                        }
                    );
                }
            })
            // res.status(200).send(
            //     {
            //         success: true,
            //         message: 'Insert theme Successfully',
            //         statusCode: 200
            //     }
            // );
        }
    })
} 