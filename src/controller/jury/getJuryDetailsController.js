const pool = require("../../config/db");
const _ = require("lodash");
const { getJuryDetails } = require("./juryDetail");
const { somethingWentWrong } = require("../../constants/messages");

exports.getJuryDetailsController = async (req, res) => {
  const { jury_id } = req.query;
  try {
    await getJuryDetails(jury_id, "Get Jury detail successfully", res, req);
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
