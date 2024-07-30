//addCommentOnArtistProfile
const pool = require("../../config/db");
const moment = require("moment-timezone");
const { passwordHashing } = require("../../constants/passwordHashing");
const { somethingWentWrong } = require("../../constants/messages");

exports.addCommentOnArtWorkController = async (req, res) => {
  const { artwork_id, jury_id, comment } = req.body;
  try {
    const query = `INSERT INTO artwork_comment(artwork_id, jury_id, comment, created_at) VALUES (${artwork_id}, ${jury_id}, '${comment}', CURRENT_TIMESTAMP)`;
    pool.query(query, async (err, result) => {
      // console.log('error: ', err);
      // console.log('result: ', result);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        // const getCommentById = `SELECT * FROM artist_comments WHERE id = ${result.rows[0].id}`;
        // const finalResponse = await pool.query(getCommentById);
        res.status(200).send({
          success: true,
          message: "Comment added Successfully.",
          data: result.rows[0],
          statusCode: 200,
        });
      }
    });
  } catch (error) {
    // console.log("error: ", error);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
