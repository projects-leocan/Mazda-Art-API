
const storagePath = "src/files/";

module.exports = {
    userPortFoliaImagePath: storagePath + "user_portfolio/",
    userProfileImagePath: storagePath + "user_profile/",
    artistGrantSubmissionFilesPath: storagePath + "artist_grant_submission_files/",

};

function getFileURLPreFixPath(req) {
    const { protocol } = req;
    // console.log("protocol", protocol)
    return `${protocol}://${req.get('host')}/`;
}
module.exports.getFileURLPreFixPath = getFileURLPreFixPath;