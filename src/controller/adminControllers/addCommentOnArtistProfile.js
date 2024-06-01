//addCommentOnArtistProfile
const pool = require("../../config/db");
const moment = require('moment-timezone');
const { passwordHashing } = require("../../constants/passwordHashing");
const { somethingWentWrong } = require("../../constants/messages");


exports.addCommentOnArtistProfileController = async (req, res) => {
    const { admin_id, artist_id, comment } = req.body
    try {
        const query = `INSERT INTO artist_comments(admin_id, artist_id, comment, created_at) VALUES (${admin_id}, ${artist_id}, '${comment}', CURRENT_TIMESTAMP) RETURNING id`
        pool.query(query, async (err, result) => {
            // console.log('error: ', err);
            // console.log('result: ', result);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        messages: somethingWentWrong,
                        statusCode: 500,
                    }
                )
            } else {
                const getCommentById = `SELECT * FROM artist_comments WHERE id = ${result.rows[0].id}`;
                const finalResponse = await pool.query(getCommentById);
                res.status(200).send(
                    {
                        success: true,
                        messages: "Comment added Successfully.",
                        data: finalResponse.rows[0],
                        statusCode: 200,
                    }
                )
            }
        });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send(
            {
                success: false,
                messages: somethingWentWrong,
                statusCode: 500,
            }
        )
    }
}