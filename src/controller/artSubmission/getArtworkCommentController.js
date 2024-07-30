const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getArtworkCommentController = async (req, res) => {
  let { admin_id, jury_id, artwork_id, record_per_page, page_no, isAll } =
    req.query;
  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT * FROM trasaction_detail`;
    // let query = `SELECT * FROM artist_comments WHERE artist_id = ${artist_id}`;
    // let query = `SELECT ac.*, a.admin_name FROM artist_comments as ac JOIN admin a ON a.admin_id = ac.admin_id WHERE artist_id = ${artist_id}`;
    // let query =
    //   admin_id === undefined
    //     ? `SELECT * FROM artwork_comment WHERE jury_id=${jury_id} AND artwork_id=${artwork_id}`
    //     : `SELECT * FROM artwork_comment WHERE artwork_id=${artwork_id}`;

    let query =
      admin_id === undefined
        ? `SELECT a.*, j.full_name, sd.art_title , sd.grant_id
FROM public.artwork_comment a, public.jury j, public.submission_details sd 
WHERE a.artwork_id = sd.id AND a.jury_id = j.id AND a.jury_id=${jury_id} AND a.artwork_id=${artwork_id}`
        : `SELECT a.*, j.full_name, sd.art_title, sd.grant_id
FROM public.artwork_comment a, public.jury j, public.submission_details sd 
WHERE a.artwork_id = sd.id AND a.jury_id = j.id AND a.artwork_id=${artwork_id}`;
    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }
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
        if (result.rows?.length > 0) {
          let data = result.rows[0]?.grant_id;
          const grant_uid_query = `SELECT grant_uid from grants where grant_id=${data}`;
          const grant_uid = await pool.query(grant_uid_query);

          const finalData = {
            data: result.rows,
            grant_uid: grant_uid.rows[0].grant_uid,
          };
          return res.status(200).send({
            success: true,
            message: "Comments get Successfully",
            data: finalData,
            statusCode: 200,
          });
        } else {
          return res.status(200).send({
            success: true,
            message: "No Comments",
            data: [],
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
