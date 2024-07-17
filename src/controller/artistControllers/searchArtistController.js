const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.searchArtistController = async (req, res) => {
  const search_text = req.query.search_text;

  try {
    // search by name
    // const query = `SELECT * FROM artist WHERE fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;

    // search by contact number
    // const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}'

    // search by name and contact number
    // console.log("search text", search_text);
    // const query = `SELECT * FROM artist WHERE mobile_number ILIKE '${search_text}%' or mobile_number ILIKE '%${search_text}' or fname ILIKE '${search_text}%' or fname ILIKE '%${search_text}' or lname ILIKE '${search_text}%' or lname ILIKE '%${search_text}'`;
    const query = `SELECT *, COUNT(*) OVER() AS totalArtist 
    FROM artist 
    WHERE mobile_number ILIKE '${search_text}%' 
       OR mobile_number ILIKE '%${search_text}' 
       OR fname ILIKE '%${search_text}%' 
       OR lname ILIKE '%${search_text}%' ORDER BY artist_id`;
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
        delete res.totalartist;
        res.status(200).send({
          success: true,
          message: "Data fetch successfully",
          totalArtist: totalArtist,
          data: result.rows,
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
