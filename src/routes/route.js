const router = require("express").Router();
// Post
const { addAdminController } = require('../controller/adminControllers/addAdminController')
const { updateAdminController } = require("../controller/adminControllers/updateAdminController");
const { deleteAdminController } = require("../controller/adminControllers/deleteAdminController");

// Admin controllers
const { getAdminController } = require('../controller/adminControllers/getAdminController');
const { adminLoginController } = require("../controller/adminControllers/adminLoginController");
const { validateAccessToken } = require("../validations/accessTokenValidation");
const { addAdminValidator, adminLoginValidation, adminIdValidator, getAllAdminValidator, addCommentOnArtistProfileValidator } = require("../validations/adminValidations");

// Artist controllers
const { getArtistProfileValidation, searchArtistValidation, getArtistDetailValidation, getArtistIdValidation, addArtistValidation } = require("../validations/artistValidations");
const { updateArtistController } = require("../controller/artistControllers/updateArtistController");
const { searchArtistController } = require("../controller/artistControllers/searchArtistController");
const { addMODControllers } = require("../controller/mediumOfChoiceControllrs/addMODController");
const { getAllMODControllers } = require("../controller/mediumOfChoiceControllrs/getAllMODControllers");
const { addMODValidation, updateMODValidation } = require("../validations/MODValidations");
const { updateMODController } = require("../controller/mediumOfChoiceControllrs/updateMODController");
const { getAllArtistController } = require("../controller/artistControllers/getAllArtistController");
const { getArtistDetailsController } = require("../controller/artistControllers/getArtistDetailsController");

//theme
const { addThemeController } = require("../controller/theme/addThemeController");
const { getAllThemeController } = require("../controller/theme/getAllThemeController");

// Grant
const { addGrantController } = require("../controller/grant/addGrantController");
const { getAllGrantController } = require("../controller/grant/getAllGrantController");
const { addGrantValidation, updateGrantValidation, getAllGrantValidation, getGrantDetailValidation, getGrantAllSubmissionsValidation } = require("../validations/grantValidations");
const { updateGrantController } = require("../controller/grant/updateGrantController");
const { updateThemeController } = require("../controller/theme/updateThemeController");
const { addThemeValidation, updateThemeValidation } = require("../validations/themeValidation");
const { getAllJuryValidation, getJuryDetailValidation, addJuryValidation, updateJuryValidation, juryLoginValidation, getJuryGrantsValidation } = require("../validations/juryValidation");
const { getAllJuryController } = require("../controller/jury/getAllJuryController");
const { getJuryDetailsController } = require("../controller/jury/getJuryDetailsController");
const { addJuryController } = require("../controller/jury/addJuryController");
const { updateJuryDetailsController } = require("../controller/jury/updateJuryController");
const { juryLoginController } = require("../controller/jury/juryLogin");
const { assignGrantToJuryController } = require("../controller/grantMapping/assignGrantToJuryController");
const { assignGrantToJuryValidator, updateGrantStatusValidator } = require("../validations/grantMappingValidations");
const { getGrantDetailsController } = require("../controller/grant/getGrantDetailController");
const { getJuryByGrantIdController } = require("../controller/grant/getJuryByGrantIdController");
const { addArtistController } = require("../controller/artistControllers/addArtistController");
const { submitGrantValidation, getSubmitGrantDetailValidation, getAllGrantSubmissionValidator } = require("../validations/submitGrantValidations");
const { submitGrantController } = require("../controller/artSubmission/submitGrantController");
const { getSubmitGrantDetailController } = require("../controller/artSubmission/getSubmitGrantDetailController");
const { updateSubmitedGrantController } = require("../controller/artSubmission/updateSubmitedGrantController");
const { getAllGrantSubmissionController } = require("../controller/artSubmission/getAllGrantSubmissionController");
const { addTransactionController } = require("../controller/transactions/addTransactionController");
const { addTransactionValidation, updateTransactionValidation, getAllTransactionValidation, getTransactionDetailValidation } = require("../validations/transactionValidations");
const { updateTransactionController } = require("../controller/transactions/updateTransactionController");
const { getAllTransactionsController } = require("../controller/transactions/getAllTransactionsController");
const { getTransactionController } = require("../controller/transactions/getTransactionDetailsController");
const { testController } = require("./test");
const { getGrantsForJuryController } = require("../controller/jury/getGrantsForJuryController");
const { getGrantAllSubmissionsController } = require("../controller/grantMapping/getGrantAllSubmissionsController");
const { updateGrantStatusController } = require("../controller/grantMapping/updateGrantStatusController");
const { addCommentOnArtistProfileController } = require("../controller/adminControllers/addCommentOnArtistProfile");
const { adminIdValidation } = require("../validations/statsValidations");
const { getTransactionStatsController } = require("../controller/statisticsControllers/getTransactionStatsController");

module.exports = app => {
    // Flow router.type(endpoint, tokenVerify, apiValidations, APIController)

    /// Medium of choices APIs
    router.post("/addMOD", validateAccessToken, addMODValidation, addMODControllers);
    router.get("/getAllMOD", validateAccessToken, getAllMODControllers);
    router.post("/updateMOD", validateAccessToken, updateMODValidation, updateMODController);

    /// admin APIs
    router.get("/adminLogin", adminLoginValidation, adminLoginController);
    router.post("/addAdmin", validateAccessToken, addAdminValidator, addAdminController);
    router.get("/getAllAdmin", validateAccessToken, getAllAdminValidator, getAdminController)
    router.post("/updateAdmin", validateAccessToken, adminIdValidator, updateAdminController);
    router.post("/deleteAdmin", validateAccessToken, adminIdValidator, deleteAdminController);
    router.post("/addCommentOnArtistProfile", validateAccessToken, addCommentOnArtistProfileValidator, addCommentOnArtistProfileController);

    /// user APIs
    router.get("/getAllUsers", validateAccessToken, getArtistProfileValidation, getAllArtistController);
    router.get("/searchUser", validateAccessToken, searchArtistValidation, searchArtistController);
    router.post("/updateUser", validateAccessToken, updateArtistController); // update user profile validation is added in controller
    router.get("/getUserDetails", validateAccessToken, getArtistIdValidation, getArtistDetailsController);
    // router.post("/createUser", validateAccessToken, addArtistValidation, addUserController);
    router.post("/createUser", validateAccessToken, addArtistController);

    /// grants
    router.post("/addGrant", validateAccessToken, addGrantValidation, addGrantController);
    router.get("/getAllGrant", validateAccessToken, getAllGrantValidation, getAllGrantController);
    router.post("/updateGrant", validateAccessToken, updateGrantValidation, updateGrantController);
    router.get("/getGrantDetails", validateAccessToken, getGrantDetailValidation, getGrantDetailsController);
    router.get("/getJuryByGrantId", validateAccessToken, getGrantDetailValidation, getJuryByGrantIdController);
    router.get("/getGrantAllSubmissions", validateAccessToken, getGrantAllSubmissionsValidation, getGrantAllSubmissionsController);

    /// theme
    router.get("/getAllTheme", validateAccessToken, getAllThemeController);
    router.post("/addTheme", validateAccessToken, addThemeValidation, addThemeController);
    router.post("/updateTheme", validateAccessToken, updateThemeValidation, updateThemeController);

    /// Jury
    router.get("/getAllJury", validateAccessToken, getAllJuryValidation, getAllJuryController);
    router.get("/getJuryDetail", validateAccessToken, getJuryDetailValidation, getJuryDetailsController);
    router.post("/addJury", validateAccessToken, addJuryValidation, addJuryController);
    router.post("/updateJury", validateAccessToken, updateJuryValidation, updateJuryDetailsController);
    router.get("/juryLogin", juryLoginValidation, juryLoginController);
    router.get("/getJuryGrants", validateAccessToken, getJuryGrantsValidation, getGrantsForJuryController);

    // grant-jury mapping (grant assign to jury assign)
    router.post("/assignGrantToJury", validateAccessToken, assignGrantToJuryValidator, assignGrantToJuryController);
    router.post("/updateGrantSubmissionStatus", validateAccessToken, updateGrantStatusValidator, updateGrantStatusController);

    // submit grant for artist
    // router.post("/submitGrant", validateAccessToken, submitGrantValidation, submitGrantController);
    router.post("/submitGrant", validateAccessToken, submitGrantController);
    router.get("/getSubmitGrantDetail", validateAccessToken, getSubmitGrantDetailValidation, getSubmitGrantDetailController);
    router.post("/updateSubmitGrantDetail", validateAccessToken, updateSubmitedGrantController);
    router.get("/getArtWorkSubmission", validateAccessToken, getAllGrantSubmissionValidator, getAllGrantSubmissionController);


    // transaction grant for artist
    router.post("/addTransaction", validateAccessToken, addTransactionValidation, addTransactionController);
    router.get("/getTransactionDetail", validateAccessToken, getTransactionDetailValidation, getTransactionController);
    router.post("/updateTransaction", validateAccessToken, updateTransactionValidation, updateTransactionController);
    router.get("/getAllTransactions", validateAccessToken, getAllTransactionValidation, getAllTransactionsController);
    // router.get("/getAllTransactions", validateAccessToken, getAllTransactionsController);


    // stats
    router.get("/getTransactionStatistics", validateAccessToken, adminIdValidation, getTransactionStatsController);
    router.get("/getSubmitArtStatistics", validateAccessToken, adminIdValidation, getTransactionStatsController);

    router.get("/test", testController);


    app.use('/api/v1', router)
}