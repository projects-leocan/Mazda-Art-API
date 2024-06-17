const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getArtistProfileCommentsController = async (req, res) => {
  let { admin_id, artist_id, record_per_page, page_no, isAll } = req.query;
  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT * FROM trasaction_detail`;
    // let query = `SELECT * FROM artist_comments WHERE artist_id = ${artist_id}`;
    let query = `SELECT ac.*, a.admin_name FROM artist_comments as ac JOIN admin a ON a.admin_id = ac.admin_id WHERE artist_id = ${artist_id}`;
    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    // console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "User details get Successfully",
          data: result.rows,
          statusCode: 200,
        });
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
