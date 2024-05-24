const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.assignGrantToJuryController = async (req, res) => {
    const { jury_id, grant_id, admin_id } = req.body;
    try {
        const currentTime = new Date().toISOString().slice(0, 10);

        const data = [jury_id, grant_id, admin_id, currentTime];
        const query = `INSERT INTO grant_assign( jury_id, grant_id, assign_by, cerated_at) VALUES (${jury_id}, ${grant_id}, ${admin_id}, '${currentTime}') RETURNING id;`;
        pool.query(query, async (err, result) => {

            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                const getNewData = `SELECT * FROM public.grant_assign WHERE id = ${result.rows[0].id}`
                const newResponse = await pool.query(getNewData);

                const finalResponse = {
                    ...newResponse.rows[0],
                    cerated_at: getUTCdate(newResponse.rows[0].cerated_at)
                }

                res.status(200).send(
                    {
                        success: true,
                        message: 'Grant assigned to jury successfully.',
                        data: finalResponse,
                        statusCode: 200
                    }
                )
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