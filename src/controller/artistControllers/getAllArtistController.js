const pool = require("../../config/db");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
  artistPortFoliaImagePath,
  artistProfileImagePath,
} = require("../../constants/filePaths");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");

exports.getAllArtistController = async (req, res) => {
  let { record_per_page, page_no, isAll, kyc, search } = req.query;

  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT artist_id, fname, lname, dob, gender, email, COUNT(*) OVER() AS totalArtist FROM artist Order by artist_id`;
    let query = `
    SELECT 
      a.artist_id, 
      a.fname, 
      a.lname, 
      a.dob, 
      a.gender, 
      a.email, 
      a.mobile_number, 
      a.state, 
      a.city, 
      a.pincode, 
      a.social_media_profile_link, 
      a.profile_pic, 
      a.artist_portfolio, 
      a.created_at, 
      ARRAY_AGG(DISTINCT am.moc_id) AS medium_of_choice, 
      COUNT(a.*) OVER() AS totalArtist 
    FROM 
      artist a 
    JOIN 
      artist_moc am ON a.artist_id = am.artist_id 
    GROUP BY 
      a.artist_id 
  `;

    // console.log("artist query", query);

    // if (isAll) {
    //   console.log("is All ---");
    //   query += ` ORDER BY artist_id DESC`;
    // }

    if (isAll == undefined) {
      offset = (page_no - 1) * record_per_page;
      query += ` ORDER BY artist_id DESC LIMIT ${record_per_page} OFFSET ${offset}`;
    }
    if (isAll === "true") {
      query += ` ORDER BY artist_id DESC`;
    }

    if (search === undefined && kyc !== undefined) {
      query += ` WHERE is_kyc_verified = '1' ORDER BY artist_id DESC`;
    }
    if (search !== undefined && kyc !== undefined) {
      query += ` WHERE is_kyc_verified = '1' AND (mobile_number ILIKE '${search}%'  
       OR mobile_number ILIKE '%${search}' 
       OR fname ILIKE '%${search}%' 
       OR lname ILIKE '%${search}%') ORDER BY artist_id DESC`;
    }

    // console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        // console.log("response", result.rows);
        //http://192.168.1.8:8080/src/files/user_portfolio/8_1716549179751.jpeg
        // src/files/user_portfolio/8_1716549179751.jpeg

        const totalArtist = result.rows[0]?.totalartist;

        const getMocData = async (list) => {
          try {
            // console.log("Inside getMocData with list:", list);
            return await Promise.all(
              list.map(async (e) => {
                const mocResult = await pool.query(
                  `SELECT id, medium_of_choice FROM medium_of_choice WHERE id = $1`,
                  [e]
                );
                // console.log("moc result", mocResult);
                return mocResult.rows[0];
              })
            );
          } catch (error) {
            console.error("Error in getMocData:", error);
            throw error; // Rethrow the error to be handled by the caller
          }
        };

        const updatedResult = await Promise.all(
          result.rows?.map(async (res) => {
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
              medium_of_choice: !lodash.isEmpty(res?.medium_of_choice)
                ? await getMocData(res?.medium_of_choice)
                : [],
              created_at: getUTCdate(res.created_at),
            };
          })
        );
        // console.log("updated result", updatedResult);
        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Data fetch successfully",
          totalArtist: totalArtist,
          // dataNew: result.rows,
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
