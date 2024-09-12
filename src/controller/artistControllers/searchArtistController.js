const pool = require("../../config/db");
const {
  userProfileImagePath,
  userPortFoliaImagePath,
  artistProfileImagePath,
  artistPortFoliaImagePath,
} = require("../../constants/filePaths");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");

exports.searchArtistController = async (req, res) => {
  const search_text = req.query.search_text;
  let { record_per_page, page_no, isAll, kyc } = req.query;

  try {
    // search by name
    // const query = `SELECT * FROM artist WHERE fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;

    // search by contact number
    // const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}'

    // search by name and contact number
    // console.log("search text", search_text);
    // const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}' or fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;

    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    let query =
      kyc === "true"
        ? `SELECT *, COUNT(*) OVER() AS totalArtist 
    FROM artist 
    WHERE is_kyc_verified = '1'
    AND (mobile_number ILIKE '${search_text}%' 
       OR mobile_number ILIKE '%${search_text}' 
       OR fname ILIKE '%${search_text}%' 
       OR lname ILIKE '%${search_text}%')`
        : `SELECT *, COUNT(*) OVER() AS totalArtist 
    FROM artist 
    WHERE mobile_number ILIKE '${search_text}%' 
       OR mobile_number ILIKE '%${search_text}' 
       OR fname ILIKE '%${search_text}%' 
       OR lname ILIKE '%${search_text}%'`;

    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` ORDER BY artist_id DESC LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    // console.log(`search query: ${query}`);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        // console.log(`response: ${JSON.stringify(result.rows)}`);
        const totalArtist = result.rows[0]?.totalartist;
        const updatedResult = result.rows?.map((res) => {
          // console.log(`__dirname: ${__dirname}`)
          // console.log(`__dirname: ${path.join(__dirname, userPortFoliaImagePath, res.artist_portfolio)}`)
          const prePath = getFileURLPreFixPath(req);
          delete res.totalartist;
          return {
            ...res,
            profile_pic:
              res.profile_pic == null
                ? null
                : `${prePath}${artistProfileImagePath}${res.profile_pic}`,
            artist_portfolio:
              res.artist_portfolio == null
                ? null
                : `${prePath}${artistPortFoliaImagePath}${res.artist_portfolio}`,
            created_at: getUTCdate(res.created_at),
          };
        });
        // delete res.totalartist;
        res.status(200).send({
          success: true,
          message: "Data fetch successfully",
          totalArtist: totalArtist,
          data: updatedResult,
          statusCode: 200,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: true,
      message: somethingWentWrong,
      data: result.rows,
      statusCode: 500,
    });
  }
};
