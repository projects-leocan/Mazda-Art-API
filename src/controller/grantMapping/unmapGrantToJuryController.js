const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");

exports.unmapGrantToJuryController = async (req, res) => {
  try {
    const { grant_map_id } = req.body;

    if (grant_map_id === undefined || grant_map_id === "") {
      return res.status(500).send({
        success: false,
        message: "Please provide grant mapping id",
      });
    } else {
      const query = `DELETE FROM grant_assign WHERE issd = ${grant_map_id}`;
      pool.query(query, async (err, result) => {
        if (err) {
          //   console.log("err", err);
          res.status(500).send({
            success: false,
            message: somethingWentWrong,
            err: err,
            statusCode: 500,
          });
        } else {
          res.status(200).send({
            success: true,
            message: "Grant Unmap Successfully",
            statusCode: 200,
          });
        }
      });
    }
  } catch (err) {
    // console.log("error", err);

    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      err: err,
      statusCode: 500,
    });
  }
};
