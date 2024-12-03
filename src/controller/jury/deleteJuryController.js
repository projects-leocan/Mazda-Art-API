const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.deleteJuryController = async (req, res) => {
  const { jury_id } = req.body;
  try {
    const newQuery1 = `DELETE FROM jury WHERE id=${jury_id}`;
    const newQuery2 = `DELETE FROM artwork_comment WHERE jury_id=${jury_id}`;
    const newQuery3 = `DELETE FROM grant_assign WHERE jury_id=${jury_id}`;
    const newQuery4 = `DELETE FROM jury_links WHERE jury_id=${jury_id}`;
    const newQuery5 = `DELETE FROM submission_review_details WHERE jury_id=${jury_id}`;

    await pool.query(newQuery2);
    await pool.query(newQuery3);
    await pool.query(newQuery4);
    await pool.query(newQuery5);
    await pool.query(newQuery1);

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Jury and related records deleted successfully",
    });
  } catch (error) {
    // console.log("error", error);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  } finally {
  }
};
