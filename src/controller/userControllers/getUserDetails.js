const pool = require("../../config/db");
const { userPortFoliaImagePath, userProfileImagePath } = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getUserDetails = async (req, res) => {
    const user_id = req.query.user_id;

    try {
        const currentTimeInMilliseconds = new Date().toISOString().slice(0, 10);
        const query = `SELECT * FROM artist WHERE artist_id = ${user_id}`;
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
                if (result.rows[0].artist_portfolio != null) {
                    result.rows[0].artist_portfolio = `${req.protocol}://${req.get('host')}/${userPortFoliaImagePath}${result.rows[0].artist_portfolio}`;
                }
                if (result.rows[0].profile_pic != null) {
                    result.rows[0].profile_pic = `${req.protocol}://${req.get('host')}/${userProfileImagePath}${result.rows[0].profile_pic}`;
                }
                return res.status(200).send(
                    {
                        success: true,
                        message: 'Medium of Choice get Successfully',
                        data: result.rows,
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