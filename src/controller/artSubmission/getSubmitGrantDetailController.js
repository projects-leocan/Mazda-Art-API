const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");

exports.getSubmitGrantDetailController = async (req, res) => {
  const { grant_submitted_id } = req.query;
  await getGrantSubmittedDetails(
    grant_submitted_id,
    "Grant Detail fetched Successfully.",
    res,
    req
  );
};
