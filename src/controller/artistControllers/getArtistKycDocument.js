const pool = require("../../config/db");
const lodash = require("lodash");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
  artistKycDocumentsPath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");

exports.getArtistKycDocumentController = async (req, res) => {
  const artist_id = req.query.artist_id;
  try {
    const query = `SELECT ad.*, a.artist_id FROM artist_kyc ad, artist_kyc_documents a WHERE a.artist_id = ${artist_id} AND ad.document_id = a.document_id`;

    pool.query(query, async (err, result) => {
      // console.log("error", err);
      // console.log("result", result);

      if (err) {
        return res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const prePath = getFileURLPreFixPath(req);
        if (result.rows[0]?.aadhar_document != null) {
          result.rows[0].aadhar_document = `${prePath}${artistKycDocumentsPath}${result.rows[0].aadhar_document}`;
        }
        if (result.rows[0]?.voting_document != null) {
          result.rows[0].voting_document = `${prePath}${artistKycDocumentsPath}${result.rows[0].voting_document}`;
        }
        if (result.rows[0]?.pan_document != null) {
          result.rows[0].pan_document = `${prePath}${artistKycDocumentsPath}${result.rows[0].pan_document}`;
        }
        if (result.rows[0]?.passport_document != null) {
          result.rows[0].passport_document = `${prePath}${artistKycDocumentsPath}${result.rows[0].passport_document}`;
        }
        return res.status(200).send({
          success: true,
          // data: result.rows,
          data: result.rows,
          statusCode: 200,
        });
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
