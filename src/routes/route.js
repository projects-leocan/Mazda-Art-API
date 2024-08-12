const router = require("express").Router();
// Post
const {
  addAdminController,
} = require("../controller/adminControllers/addAdminController");
const {
  updateAdminController,
} = require("../controller/adminControllers/updateAdminController");
const {
  deleteAdminController,
} = require("../controller/adminControllers/deleteAdminController");

// Admin controllers
const {
  getAdminController,
} = require("../controller/adminControllers/getAdminController");
const {
  adminLoginController,
} = require("../controller/adminControllers/adminLoginController");
const { validateAccessToken } = require("../validations/accessTokenValidation");
const {
  addAdminValidator,
  adminLoginValidation,
  adminIdValidator,
  getAllAdminValidator,
  addCommentOnArtistProfileValidator,
  getAdminDetailsValidator,
} = require("../validations/adminValidations");

// Artist controllers
const {
  getArtistProfileValidation,
  searchArtistValidation,
  getArtistDetailValidation,
  getArtistIdValidation,
  addArtistValidation,
} = require("../validations/artistValidations");
const {
  updateArtistController,
} = require("../controller/artistControllers/updateArtistController");
const {
  searchArtistController,
} = require("../controller/artistControllers/searchArtistController");
const {
  addMODControllers,
} = require("../controller/mediumOfChoiceControllrs/addMODController");
const {
  getAllMODControllers,
} = require("../controller/mediumOfChoiceControllrs/getAllMODControllers");
const {
  addMODValidation,
  updateMODValidation,
} = require("../validations/MODValidations");
const {
  updateMODController,
} = require("../controller/mediumOfChoiceControllrs/updateMODController");
const {
  getAllArtistController,
} = require("../controller/artistControllers/getAllArtistController");
const {
  getArtistDetailsController,
} = require("../controller/artistControllers/getArtistDetailsController");

//theme
const {
  addThemeController,
} = require("../controller/theme/addThemeController");
const {
  getAllThemeController,
} = require("../controller/theme/getAllThemeController");

// Grant
const {
  addGrantController,
} = require("../controller/grant/addGrantController");
const {
  getAllGrantController,
} = require("../controller/grant/getAllGrantController");
const {
  addGrantValidation,
  updateGrantValidation,
  getAllGrantValidation,
  getGrantDetailValidation,
  getGrantAllSubmissionsValidation,
} = require("../validations/grantValidations");
const {
  updateGrantController,
} = require("../controller/grant/updateGrantController");
const {
  updateThemeController,
} = require("../controller/theme/updateThemeController");
const {
  addThemeValidation,
  updateThemeValidation,
} = require("../validations/themeValidation");
const {
  getAllJuryValidation,
  getJuryDetailValidation,
  addJuryValidation,
  updateJuryValidation,
  juryLoginValidation,
  getJuryGrantsValidation,
} = require("../validations/juryValidation");
const {
  getAllJuryController,
} = require("../controller/jury/getAllJuryController");
const {
  getJuryDetailsController,
} = require("../controller/jury/getJuryDetailsController");
const { addJuryController } = require("../controller/jury/addJuryController");
const {
  updateJuryDetailsController,
} = require("../controller/jury/updateJuryController");
const { juryLoginController } = require("../controller/jury/juryLogin");
const {
  assignGrantToJuryController,
} = require("../controller/grantMapping/assignGrantToJuryController");
const {
  assignGrantToJuryValidator,
  updateGrantStatusValidator,
  getGrantJuryMappingValidation,
  getGrantJuryMappingDetailsValidation,
} = require("../validations/grantMappingValidations");
const {
  getGrantDetailsController,
} = require("../controller/grant/getGrantDetailController");
const {
  getJuryByGrantIdController,
} = require("../controller/grant/getJuryByGrantIdController");
const {
  addArtistController,
} = require("../controller/artistControllers/addArtistController");
const {
  submitGrantValidation,
  getSubmitGrantDetailValidation,
  getAllGrantSubmissionValidator,
} = require("../validations/submitGrantValidations");
const {
  submitGrantController,
} = require("../controller/artSubmission/submitGrantController");
const {
  getSubmitGrantDetailController,
} = require("../controller/artSubmission/getSubmitGrantDetailController");
const {
  updateSubmitedGrantController,
} = require("../controller/artSubmission/updateSubmitedGrantController");
const {
  getAllGrantSubmissionController,
} = require("../controller/artSubmission/getAllGrantSubmissionController");
const {
  addTransactionController,
} = require("../controller/transactions/addTransactionController");
const {
  addTransactionValidation,
  updateTransactionValidation,
  getAllTransactionValidation,
  getTransactionDetailValidation,
  getArtistProfileCommentsValidation,
} = require("../validations/transactionValidations");
const {
  updateTransactionController,
} = require("../controller/transactions/updateTransactionController");
const {
  getAllTransactionsController,
} = require("../controller/transactions/getAllTransactionsController");
const {
  getTransactionController,
} = require("../controller/transactions/getTransactionDetailsController");
const { testController } = require("./test");
const {
  getGrantsForJuryController,
} = require("../controller/jury/getGrantsForJuryController");
const {
  getGrantAllSubmissionsController,
} = require("../controller/grantMapping/getGrantAllSubmissionsController");
const {
  updateGrantStatusController,
} = require("../controller/grantMapping/updateGrantStatusController");
const {
  addCommentOnArtistProfileController,
} = require("../controller/adminControllers/addCommentOnArtistProfile");
const { adminIdValidation } = require("../validations/statsValidations");
const {
  getTransactionStatsController,
} = require("../controller/statisticsControllers/getTransactionStatsController");
const {
  getSubmitArtStatisticsController,
} = require("../controller/statisticsControllers/getSubmitArtStatisticsController");
const {
  getJuryStatisticsController,
} = require("../controller/statisticsControllers/getJuryStatisticsController");
const {
  addEnquiryController,
} = require("../controller/enquiryControllers/addEnquiryController");
const {
  addEnquiryValidation,
  getAllEnquiryValidation,
  updateEnquiryValidation,
} = require("../validations/enquiriesValidations");
const {
  getAllUnresolvedEnquiryController,
  getAllEnquiryController,
} = require("../controller/enquiryControllers/getAllEnquiryController");
const {
  getGrantJuryMappingController,
} = require("../controller/grantMapping/getGrantJuryMappingController");
const {
  getJuryGrantsArtSubmissionsController,
} = require("../controller/jury/getJuryGrantsArtSubmissionsController");
const {
  getArtistProfileCommentsController,
} = require("../controller/artistControllers/getArtistProfileCommentsController");

// Shweta Changes

const {
  updateEnquiryController,
} = require("../controller/enquiryControllers/updateEnquiryController");
const {
  getAdminDetailsController,
} = require("../controller/adminControllers/getAdminDetailsController");
const {
  getAllContactUsValidation,
  addContactUsValidation,
  updateContactUsValidation,
} = require("../validations/contactUsValidations");
const {
  getAllContactUsController,
} = require("../controller/contactUsControllers/getAllContactUsController");
const {
  addContactUsController,
} = require("../controller/contactUsControllers/addContactUsController");
const {
  updateContactUsController,
} = require("../controller/contactUsControllers/updateContactUsController");

const {
  getGrantJuryMappingDetailsController,
} = require("../controller/grantMapping/getGrantJuryMappingDetailsController");
const {
  demoController,
} = require("../controller/demoControllers/demoController");
const {
  getAllArtistDemoController,
} = require("../controller/demoControllers/getAllArtistDemoController");
const {
  getGrantWiseSubmitArtStatisticsController,
} = require("../controller/statisticsControllers/getGrantWiseSubmitArtStatisticsController");
// const {
//   addArtistKycController,
// } = require("../controller/artistControllers/addArtistKycController");
const {
  getArtistKycDocumentController,
} = require("../controller/artistControllers/getArtistKycDocument");
const {
  addCommentOnArtWorkController,
} = require("../controller/artSubmission/addCommentOnArtWorkController");
const {
  getArtworkCommentController,
} = require("../controller/artSubmission/getArtworkCommentController");
const {
  getSubmitArtworkStatusController,
} = require("../controller/artSubmission/getSubmitArtworkStatusController");
// const {
//   addArtistWithImageController,
// } = require("../controller/artistControllers/addArtistWithImageController");
const {
  updateArtistWithImageController,
} = require("../controller/artistControllers/updateArtistWithImageController");
const {
  updateAdminArtworkStatusController,
} = require("../controller/artSubmission/updateAdminArtworkStatusController");
const {
  updateAdminRoleController,
} = require("../controller/adminControllers/updateAdminRoleController");
const {
  getAdminRoleController,
} = require("../controller/adminControllers/getAdminRoleController");
const {
  getAdminRoleByIdController,
} = require("../controller/adminControllers/getAdminRoleByIdController");

module.exports = (app) => {
  // Flow router.type(endpoint, tokenVerify, apiValidations, APIController)

  /// Medium of choices APIs
  router.post(
    "/addMOD",
    validateAccessToken,
    addMODValidation,
    addMODControllers
  );
  router.get("/getAllMOD", validateAccessToken, getAllMODControllers);
  router.post(
    "/updateMOD",
    validateAccessToken,
    updateMODValidation,
    updateMODController
  );

  /// admin APIs
  router.get("/adminLogin", adminLoginValidation, adminLoginController);
  router.post(
    "/addAdmin",
    validateAccessToken,
    addAdminValidator,
    addAdminController
  );
  router.get(
    "/getAllAdmin",
    validateAccessToken,
    getAllAdminValidator,
    getAdminController
  );
  router.post(
    "/updateAdmin",
    validateAccessToken,
    adminIdValidator,
    updateAdminController
  );
  router.post(
    "/deleteAdmin",
    validateAccessToken,
    adminIdValidator,
    deleteAdminController
  );
  router.post(
    "/addCommentOnArtistProfile",
    validateAccessToken,
    addCommentOnArtistProfileValidator,
    addCommentOnArtistProfileController
  );

  /// user APIs
  router.get(
    "/getAllUsers",
    validateAccessToken,
    getArtistProfileValidation,
    getAllArtistController
  );
  router.get(
    "/searchUser",
    validateAccessToken,
    searchArtistValidation,
    searchArtistController
  );
  // router.post("/updateUser", validateAccessToken, updateArtistController); // update user profile validation is added in controller
  router.post(
    "/updateUser",
    validateAccessToken,
    updateArtistWithImageController
  ); // update user profile validation is added in controller

  router.get(
    "/getUserDetails",
    validateAccessToken,
    getArtistIdValidation,
    getArtistDetailsController
  );
  // router.post("/createUser", validateAccessToken, addArtistValidation, addUserController);
  router.post("/createUser", validateAccessToken, addArtistController);

  /// grants
  router.post(
    "/addGrant",
    validateAccessToken,
    addGrantValidation,
    addGrantController
  );
  router.get(
    "/getAllGrant",
    validateAccessToken,
    getAllGrantValidation,
    getAllGrantController
  );
  router.post(
    "/updateGrant",
    validateAccessToken,
    updateGrantValidation,
    updateGrantController
  );
  router.get(
    "/getGrantDetails",
    validateAccessToken,
    getGrantDetailValidation,
    getGrantDetailsController
  );
  router.get(
    "/getJuryByGrantId",
    validateAccessToken,
    getGrantDetailValidation,
    getJuryByGrantIdController
  );
  router.get(
    "/getGrantAllSubmissions",
    validateAccessToken,
    getGrantAllSubmissionsValidation,
    getGrantAllSubmissionsController
  );

  /// theme
  router.get("/getAllTheme", validateAccessToken, getAllThemeController);
  router.post(
    "/addTheme",
    validateAccessToken,
    addThemeValidation,
    addThemeController
  );
  router.post(
    "/updateTheme",
    validateAccessToken,
    updateThemeValidation,
    updateThemeController
  );

  /// Jury
  router.get(
    "/getAllJury",
    validateAccessToken,
    getAllJuryValidation,
    getAllJuryController
  );
  router.get(
    "/getJuryDetail",
    validateAccessToken,
    getJuryDetailValidation,
    getJuryDetailsController
  );
  router.post(
    "/addJury",
    validateAccessToken,
    addJuryValidation,
    addJuryController
  );
  router.post(
    "/updateJury",
    validateAccessToken,
    updateJuryValidation,
    updateJuryDetailsController
  );
  router.get("/juryLogin", juryLoginValidation, juryLoginController);
  router.get(
    "/getJuryGrants",
    validateAccessToken,
    getJuryGrantsValidation,
    getGrantsForJuryController
  );
  router.get(
    "/getJuryGrantsArtSubmissions",
    validateAccessToken,
    getJuryGrantsValidation,
    getJuryGrantsArtSubmissionsController
  );

  // grant-jury mapping (grant assign to jury assign)
  router.post(
    "/assignGrantToJury",
    validateAccessToken,
    assignGrantToJuryValidator,
    assignGrantToJuryController
  );
  router.post(
    "/updateGrantSubmissionStatus",
    validateAccessToken,
    updateGrantStatusValidator,
    updateGrantStatusController
  );
  router.get(
    "/getGrantJuryMapping",
    validateAccessToken,
    getGrantJuryMappingValidation,
    getGrantJuryMappingController
  );

  // submit grant for artist
  // router.post("/submitGrant", validateAccessToken, submitGrantValidation, submitGrantController);
  router.post("/submitGrant", validateAccessToken, submitGrantController);
  router.get(
    "/getSubmitGrantDetail",
    validateAccessToken,
    getSubmitGrantDetailValidation,
    getSubmitGrantDetailController
  );
  router.post(
    "/updateSubmitGrantDetail",
    validateAccessToken,
    updateSubmitedGrantController
  );
  router.get(
    "/getArtWorkSubmission",
    validateAccessToken,
    getAllGrantSubmissionValidator,
    getAllGrantSubmissionController
  );

  // transaction grant for artist
  router.post(
    "/addTransaction",
    validateAccessToken,
    addTransactionValidation,
    addTransactionController
  );
  router.get(
    "/getTransactionDetail",
    validateAccessToken,
    getTransactionDetailValidation,
    getTransactionController
  );
  router.post(
    "/updateTransaction",
    validateAccessToken,
    updateTransactionValidation,
    updateTransactionController
  );
  router.get(
    "/getAllTransactions",
    validateAccessToken,
    getAllTransactionValidation,
    getAllTransactionsController
  );
  router.get(
    "/getArtistProfileComments",
    validateAccessToken,
    getArtistProfileCommentsValidation,
    getArtistProfileCommentsController
  );
  // router.get("/getAllTransactions", validateAccessToken, getAllTransactionsController);

  // stats
  router.get(
    "/getTransactionStatistics",
    validateAccessToken,
    adminIdValidation,
    getTransactionStatsController
  );
  router.get(
    "/getSubmitArtStatistics",
    validateAccessToken,
    adminIdValidation,
    getSubmitArtStatisticsController
  );
  router.get(
    "/getGrantWiseSubmitArtStatistics",
    validateAccessToken,
    adminIdValidation,
    getGrantWiseSubmitArtStatisticsController
  );
  router.get(
    "/getJuryStatistics",
    validateAccessToken,
    adminIdValidation,
    getJuryStatisticsController
  );

  // enquiry
  router.get(
    "/getAllUnresolvedEnquiry",
    validateAccessToken,
    getAllEnquiryValidation,
    getAllEnquiryController
  );
  router.post(
    "/addEnquiry",
    validateAccessToken,
    addEnquiryValidation,
    addEnquiryController
  );
  router.post(
    "/resolveEnquiry",
    validateAccessToken,
    addEnquiryValidation,
    addEnquiryController
  );

  router.post(
    "/updateEnquiry",
    validateAccessToken,
    updateEnquiryValidation,
    updateEnquiryController
  );

  router.get(
    "/getAdminDetails",
    validateAccessToken,
    getAdminDetailsValidator,
    getAdminDetailsController
  );

  // contact us
  router.get(
    "/getAllUnresolvedContactUs",
    validateAccessToken,
    getAllContactUsValidation,
    getAllContactUsController
  );
  router.post(
    "/addContactUs",
    validateAccessToken,
    addContactUsValidation,
    addContactUsController
  );

  router.post(
    "/updateContactUs",
    validateAccessToken,
    updateContactUsValidation,
    updateContactUsController
  );

  router.get(
    "/getGrantJuryMappingDetails",
    validateAccessToken,
    getGrantJuryMappingDetailsValidation,
    getGrantJuryMappingDetailsController
  );

  router.post(
    "/addCommentOnArtwork",
    validateAccessToken,
    addCommentOnArtWorkController
  );

  router.get(
    "/getArtistKycDocument",
    validateAccessToken,
    getArtistKycDocumentController
  );

  router.get(
    "/getArtworkComment",
    validateAccessToken,
    getArtworkCommentController
  );

  router.get(
    "/getSubmitArtworkStatus",
    validateAccessToken,
    getSubmitArtworkStatusController
  );

  router.post(
    "/updateAdminArtworkStatus",
    validateAccessToken,
    updateAdminArtworkStatusController
  );

  // Update Admin Role

  router.post(
    "/updateAdminRole",
    validateAccessToken,
    updateAdminRoleController
  );

  router.get("/getAdminRole", validateAccessToken, getAdminRoleController);

  router.get(
    "/getAdminRoleById",
    validateAccessToken,
    getAdminRoleByIdController
  );

  // Demo artist image upload

  // router.post(
  //   "/createUserWithImage",
  //   validateAccessToken,
  //   addArtistWithImageController
  // );

  router.get("/demo", demoController);
  router.get("/getAllArtistDemo", getAllArtistDemoController);

  router.get("/test", testController);

  app.use("/api/v1", router);
};
