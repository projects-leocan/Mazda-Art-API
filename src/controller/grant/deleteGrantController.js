const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.deleteGrantController = async (req, res) => {
  const { grant_id } = req.body;
  console.log("grant id", req);

  try {
    const newQuery1 = `DELETE FROM grants WHERE grant_id=${+grant_id}`;
    const newQuery2 = `DELETE FROM grant_theme WHERE grant_id=${+grant_id}`;
    const newQuery3 = `DELETE FROM grant_moc WHERE grant_id=${+grant_id}`;
    const newQuery4 = `DELETE FROM grant_assign WHERE grant_id=${+grant_id}`;
    const newQuery6 = `DELETE FROM trasaction_detail WHERE grant_id=${+grant_id}`;

    console.log("new queir 1", newQuery1);
    await pool.query(newQuery1);
    await pool.query(newQuery2);
    await pool.query(newQuery3);
    await pool.query(newQuery4);
    await pool.query(newQuery6);

    return res.status(200).send({
      success: true,
      statusCode: 200,
      message: "Grant and related records deleted successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  } finally {
  }
};
