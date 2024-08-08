const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.getSubmitArtworkStatusController = async (req, res) => {
  try {
    let { artwork_id, jury_id, grantId } = req.query;
    //     let query = `SELECT sd.status, sd.star_assigned, sd.comment, g.grant_uid, j.full_name
    // FROM submission_details sd, grants g, jury j
    // WHERE sd.grant_id = g.grant_id AND sd.jury_id = j.id AND sd.id = ${artwork_id}`;

    let query =
      jury_id === undefined
        ? //         `SELECT j.id, j.full_name, sd.status, sd.star_assigned, sd.comment, sd.art_title
          // FROM jury j LEFT JOIN submission_details sd ON sd.jury_id = j.id
          // WHERE j.id IN
          // (SELECT jury_id FROM grant_assign
          // 	WHERE grant_id in (SELECT grant_id FROM public.submission_details WHERE artwork_id = ${artwork_id})) AND (sd.artwork_id = ${artwork_id} OR sd.artwork_id IS NULL)`
          `SELECT jd.*, sd.*, jury.full_name FROM 
    (SELECT jury_id FROM grant_assign WHERE grant_id=${grantId}) AS jd
    LEFT JOIN (SELECT * FROM submission_review_details WHERE artwork_id = ${artwork_id}) AS sd
    ON sd.jury_id = jd.jury_id
    LEFT JOIN jury
    ON jury.id = jd.jury_id;`
        : //         `select * from (select jury_id from grant_assign where grant_id = ${grantId}) as jd
          // LEFT JOIN (select jd.full_name from (select * from submission_review_details where artwork_id = ${artwork_id}) as filter_submission ) as sd
          // on  sd.jury_id = jd.jury_id`
          //         `SELECT j.id, j.full_name, sd.status, sd.star_assigned, sd.comment, sd.art_title
          // FROM jury j LEFT JOIN submission_details sd ON sd.jury_id = j.id
          // WHERE sd.jury_id = ${jury_id} AND j.id IN
          // (SELECT jury_id FROM grant_assign
          // 	WHERE grant_id in (SELECT grant_id FROM public.submission_details WHERE id = ${artwork_id}))`;
          //           `SELECT j.full_name, s.status, s.star_assigned, s.comment, s.art_title
          // FROM public.submission_review_details s, public.jury j
          // WHERE s.jury_id = j.id AND s.artwork_id = ${artwork_id} AND s.jury_id = ${jury_id}`;
          `SELECT j.full_name, s.status, s.star_assigned, s.comment, sd.art_title 
FROM public.submission_review_details s, public.jury j, public.submission_details sd 
WHERE s.jury_id = j.id AND s.artwork_id = ${artwork_id} AND s.jury_id = ${jury_id} AND s.artwork_id = sd.id`;

    pool.query(query, async (err, result) => {
      // console.log("result.rows", result.rows);
      console.log("query", query);

      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const grant_id_query = `SELECT grant_uid FROM grants WHERE grant_id in (SELECT grant_id FROM submission_details where artwork_id = ${artwork_id})`;
        const grant_id_result = await pool.query(grant_id_query);
        const grant_uid = grant_id_result.rows[0]?.grant_uid;

        result.rows.map((row) => {
          row.grant_uid = grant_uid;
        });
        res.status(200).send({
          success: true,
          message: "Get Artwork Status Successfully",
          statusCode: 200,
          data: result.rows,
        });
      }
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
