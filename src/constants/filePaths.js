const storagePath = "src/files/";

module.exports = {
  userPortFoliaImagePath: storagePath + "user_portfolio/",
  userProfileImagePath: storagePath + "user_profile/",
  artistPortFoliaImagePath: storagePath + "artist_portfolio/",

  artistProfileImagePath: storagePath + "artist_profile/",

  artistGrantSubmissionFilesPath:
    storagePath + "artist_grant_submission_files/",
  artistKycDocumentsPath: storagePath + "artist_kyc_documents/",
};

function getFileURLPreFixPath(req) {
  const { protocol } = req;
  // console.log("protocol", protocol)
  return `${protocol}://${req.get("host")}/`;
}
module.exports.getFileURLPreFixPath = getFileURLPreFixPath;
