const pool = require("../../config/db");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
  getFileURLPreFixPath,
} = require("../../constants/filePaths");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllArtistDemoController = async (req, res) => {
  try {
    let query = `SELECT artist_id, fname, lname, dob, gender, email, profile_pic, artist_portfolio, created_at, COUNT(*) OVER() AS totalArtist FROM artist`;

    pool.query(query, async (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const totalArtist = result.rows[0].totalartist;
        const updatedResult = result.rows?.map((res) => {
          const prePath = getFileURLPreFixPath(req);
          delete res.totalartist;
          return {
            ...res,
            profile_pic:
              res.profile_pic == null
                ? null
                : `${prePath}${userProfileImagePath}${res.profile_pic}`,
            artist_portfolio:
              res.artist_portfolio == null
                ? null
                : `${prePath}${userPortFoliaImagePath}${res.artist_portfolio}`,
            created_at: getUTCdate(res.created_at),
          };
        });
        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Data fetch successfully",
          totalArtist: totalArtist,
          data: updatedResult,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
