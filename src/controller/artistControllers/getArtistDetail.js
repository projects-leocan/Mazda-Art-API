const pool = require("../../config/db");
const lodash = require('lodash');
const {
    userPortFoliaImagePath,
    userProfileImagePath,
    getFileURLPreFixPath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getArtistDetails = async (artist_id, message, res, req) => {
    // console.log("props artist", req)
    try {
        // const query = `SELECT * FROM artist WHERE artist_id = ${user_id}`;
        const query = `SELECT 
            artist.*,
            ARRAY_AGG(artist_moc.moc_id) AS artist_moc
        FROM artist
        LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
        WHERE artist.artist_id = ${artist_id}
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

                    let data = await Promise.all(
                        [
                            (!lodash.isEmpty(result.rows[0].artist_moc) && result.rows[0].artist_moc != [null]) ? mocData = await getMocData(result.rows[0].artist_moc) : [],
                            await getGrantsData(artist_id, req),
                            await getArtistComments(artist_id),
                        ]
                    );

                    delete result.rows[0].artist_moc;
                    const finalResult = {
                        ...result.rows[0],
                        mocs: data[0],
                        grants: data[1],
                        comments: data[2],
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


const getGrantsData = async (artist_id, req) => {
    const submitted_grant_data = await pool.query(`SELECT * FROM submission_details WHERE artist_id=${artist_id}`)
    console.log('submitted_grant_data: ', JSON.stringify(submitted_grant_data));
    if (!lodash.isEmpty(submitted_grant_data.rows)) {
        const prePath = getFileURLPreFixPath(req);
        submitted_grant_data.rows.map((e) => {
            delete e.transaction_id,
                delete e.jury_id,
                e.art_file = `${prePath}${userProfileImagePath}${e.art_file}`
        })
    }
    return submitted_grant_data.rows;
}

const getMocData = async (list) => {
    return await Promise.all(list.map(async (e) => {
        const mocResult = await pool.query(`SELECT id, medium_of_choice FROM medium_of_choice where id = ${e}`);
        return mocResult.rows[0]
    }))
}
const getArtistComments = async (artist_id) => {
    const comments_data = await pool.query(`SELECT * FROM artist_comments WHERE artist_id=${artist_id}`)
    // console.log('comments_data: ', JSON.stringify(comments_data));
    if (!lodash.isEmpty(comments_data.rows)) {
        comments_data.rows.map((e) => {
            e.created_at = getUTCdate(e.created_at)
        })
    }
    return comments_data.rows;
}