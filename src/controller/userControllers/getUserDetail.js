const pool = require("../../config/db");
const lodash = require('lodash');
const {
    userPortFoliaImagePath,
    userProfileImagePath,
    getFileURLPreFixPath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getUserDetails = async (user_id, message, res, req) => {
    try {
        // const query = `SELECT * FROM artist WHERE artist_id = ${user_id}`;
        const query = `SELECT 
            artist.*,
            ARRAY_AGG(artist_moc.moc_id) AS artist_moc
        FROM artist
        LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
        WHERE artist.artist_id = ${user_id}
        GROUP BY artist.artist_id`;

        pool.query(query, async (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    messages: err,
                    statusCode: 500,
                });
            } else {
                if (result.rowCount === 0) {
                    return res.status(500).send({
                        success: false,
                        message: "User not found.",
                        statusCode: 500,
                    });
                } else {
                    const prePath = getFileURLPreFixPath(req);
                    if (result.rows[0].artist_portfolio != null) {
                        result.rows[0].artist_portfolio = `${prePath}${userPortFoliaImagePath}${result.rows[0].artist_portfolio}`;
                    }
                    if (result.rows[0].profile_pic != null) {
                        result.rows[0].profile_pic = `${prePath}${userProfileImagePath}${result.rows[0].profile_pic}`;
                    }
                    // console.log("mocs: ", result.rows[0].artist_moc);
                    let mocData;
                    if (!lodash.isEmpty(result.rows[0].artist_moc) && result.rows[0].artist_moc != [null]) {
                        mocData = await Promise.all(result.rows[0].artist_moc.map(async (e) => {
                            const mocResult = await pool.query(`SELECT id, medium_of_choice FROM medium_of_choice where id = ${e}`);
                            // console.log("mocResult: ", JSON.stringify(mocResult));
                            return mocResult.rows[0]
                        }))
                    }
                    delete result.rows[0].artist_moc;
                    const finalResult = {
                        ...result.rows[0],
                        mocs: mocData ?? []
                    }
                    return res.status(200).send({
                        success: true,
                        message: message,
                        // data: result.rows,
                        data: finalResult,
                        statusCode: 200,
                    });
                }
            }
        });
    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
        });
    }
};
