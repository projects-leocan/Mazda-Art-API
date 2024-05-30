const pool = require("../../config/db");
const { userPortFoliaImagePath, userProfileImagePath, getFileURLPreFixPath } = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");
const { getUserDetails } = require("./getArtistDetail");

exports.getArtistDetailsController = async (req, res) => {
    const user_id = req.query.user_id;

    getUserDetails(user_id, 'User details get Successfully', res, req);

    /*try {
        const currentTimeInMilliseconds = new Date().toISOString().slice(0, 10);
        // const query = `SELECT * FROM artist WHERE artist_id = ${user_id}`;
        const query = `SELECT 
        artist.*,
        ARRAY_AGG(artist_moc.moc_id) AS artist_moc
      FROM artist
      LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
    WHERE artist.artist_id = ${user_id}
    GROUP BY artist.artist_id`;
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
                const prePath = getFileURLPreFixPath(req);
                if (result.rows[0].artist_portfolio != null) {
                    result.rows[0].artist_portfolio = `${prePath}${userPortFoliaImagePath}${result.rows[0].artist_portfolio}`;
                }
                if (result.rows[0].profile_pic != null) {
                    result.rows[0].profile_pic = `${prePath}${userProfileImagePath}${result.rows[0].profile_pic}`;
                }
                return res.status(200).send(
                    {
                        success: true,
                        message: 'User details get Successfully',
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
    }*/
}