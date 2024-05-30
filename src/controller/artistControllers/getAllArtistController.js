const pool = require("../../config/db");
const { userPortFoliaImagePath, userProfileImagePath, getFileURLPreFixPath } = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllArtistController = async (req, res) => {
    let { record_per_page, page_no, isAll } = req.query;

    try {
        if (record_per_page == undefined) {
            record_per_page = 10;
        }
        if (page_no == undefined) {
            page_no = 1;
        }
        let query = `SELECT artist_id, fname, lname, dob, gender, email, COUNT(*) OVER() AS totalArtist FROM artist Order by artist_id`;

        if (isAll == undefined) {
            offset = (page_no - 1) * record_per_page;
            query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
        }
        // console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                // console.log(`response: ${JSON.stringify(result.rows)}`);
                //http://192.168.1.8:8080/src/files/user_portfolio/8_1716549179751.jpeg
                // src/files/user_portfolio/8_1716549179751.jpeg

                const updatedResult = result.rows?.map((res) => {
                    // console.log(`__dirname: ${__dirname}`)
                    // console.log(`__dirname: ${path.join(__dirname, userPortFoliaImagePath, res.artist_portfolio)}`)
                    const prePath = getFileURLPreFixPath(req);
                    return {
                        ...res,
                        // profile_pic2: (res.profile_pic == null) ? null : `${req.protocol}://${req.get('host')}/${userPortFoliaImagePath}${res.profile_pic}`,
                        profile_pic2: (res.profile_pic == null) ? null : `${prePath}${userPortFoliaImagePath}${res.profile_pic}`,
                        artist_portfolio2: (res.artist_portfolio == null) ? null : `${prePath}${userProfileImagePath}${res.artist_portfolio}`,
                    }
                })
                res.status(200).send(
                    {
                        success: true,
                        statusCode: 200,
                        message: 'Data fetch successfully',
                        totalArtist: (result.rows.length > 0) ? result.rows[0].totalartist : 0,
                        // dataNew: result.rows,
                        data: updatedResult,
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