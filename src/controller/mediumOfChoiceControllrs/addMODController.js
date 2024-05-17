const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.addMODControllers = async (req, res) => {
    const { mod_value, admin_id } = req.body;

    try {
        const currentTimeInMilliseconds = new Date().toISOString().slice(0, 10);
        const query = `INSERT INTO medium_of_choice (medium_of_choice, created_by, updated_by, created_at, updated_at) VALUES ('${mod_value}', ${admin_id}, ${admin_id}, '${currentTimeInMilliseconds}', '${currentTimeInMilliseconds}');`;
        // console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {
            // console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        messages: err,
                        statusCode: 500
                    }
                )
            } else {
                return res.status(200).send(
                    {
                        success: true,
                        message: 'Medium of Choice added Successfully',
                        statusCode: 200
                    }
                );
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