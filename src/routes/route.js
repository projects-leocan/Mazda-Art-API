const router = require("express").Router();
// Post
const { addAdminController } = require('../controller/adminControllers/addAdminController')
const { updateAdminController } = require("../controller/adminControllers/updateAdminController");
const { deleteAdminController } = require("../controller/adminControllers/deleteAdminController");

// Admin controllers
const { getAdminController } = require('../controller/adminControllers/getAdminController');
const { adminLoginController } = require("../controller/adminControllers/adminLoginController");
const { validateAccessToken } = require("../validations/accessTokenValidation");
const { addAdminValidator, adminLoginValidation, adminIdValidator, getAllAdminValidator } = require("../validations/adminValidations");

// User controllers
const { getUserProfileValidation, searchUserValidation, getUserDetailValidation, getUserIdValidation, addUserValidation } = require("../validations/userValidations");
const { updateUserController } = require("../controller/userControllers/updateUserController");
const { searchUserController } = require("../controller/userControllers/searchUserController");
const { addMODControllers } = require("../controller/mediumOfChoiceControllrs/addMODController");
const { getAllMODControllers } = require("../controller/mediumOfChoiceControllrs/getAllMODControllers");
const { addMODValidation, updateMODValidation } = require("../validations/MODValidations");
const { updateMODController } = require("../controller/mediumOfChoiceControllrs/updateMODController");
const { getAllUsersController } = require("../controller/userControllers/getAllUsersController");
const { getUserDetailsController } = require("../controller/userControllers/getUserDetailsController");

//theme
const { addThemeController } = require("../controller/theme/addThemeController");
const { getAllThemeController } = require("../controller/theme/getAllThemeController");

// Grant
const { addGrantController } = require("../controller/grant/addGrantController");
const { getAllGrantController } = require("../controller/grant/getAllGrantController");
const { addGrantValidation, updateGrantValidation, getAllGrantValidation, getGrantDetailValidation } = require("../validations/grantValidations");
const { updateGrantController } = require("../controller/grant/updateGrantController");
const { updateThemeController } = require("../controller/theme/updateThemeController");
const { addThemeValidation, updateThemeValidation } = require("../validations/themeValidation");
const { getAllJuryValidation, getJuryDetailValidation, addJuryValidation, updateJuryValidation, juryLoginValidation } = require("../validations/juryValidation");
const { getAllJuryController } = require("../controller/jury/getAllJuryController");
const { getJuryDetailsController } = require("../controller/jury/getJuryDetailsController");
const { addJuryController } = require("../controller/jury/addJuryController");
const { updateJuryDetailsController } = require("../controller/jury/updateJuryController");
const { juryLoginController } = require("../controller/jury/juryLogin");
const { assignGrantToJuryController } = require("../controller/grantMapping/assignGrantToJuryController");
const { assignGrantToJuryValidator } = require("../validations/grantMappingValidations");
const { getGrantDetailsController } = require("../controller/grant/getGrantDetailController");
const { getJuryByGrantIdController } = require("../controller/grant/getJuryByGrantIdController");
const { addUserController } = require("../controller/userControllers/addUserController");
const { submitGrantValidation, getSubmitGrantDetailValidation, getAllGrantSubmissionValidator } = require("../validations/submitGrantValidations");
const { submitGrantController } = require("../controller/artSubmission/submitGrantController");
const { getSubmitGrantDetailController } = require("../controller/artSubmission/getSubmitGrantDetailController");
const { updateSubmitedGrantController } = require("../controller/artSubmission/updateSubmitedGrantController");
const { getAllGrantSubmissionController } = require("../controller/artSubmission/getAllGrantSubmissionController");
const { addTransactionController } = require("../controller/transactions/addTransactionController");
const { addTransactionValidation, updateTransactionValidation, getAllTransactionValidation } = require("../validations/transactionValidations");
const { updateTransactionController } = require("../controller/transactions/updateTransactionController");
const { getAllTransactionsController } = require("../controller/transactions/getAllTransactionsController");

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

    /// user APIs
    router.get("/getAllUsers", validateAccessToken, getUserProfileValidation, getAllUsersController);
    router.get("/searchUser", validateAccessToken, searchUserValidation, searchUserController);
    router.post("/updateUser", validateAccessToken, updateUserController); // update user profile validation is added in controller
    router.get("/getUserDetails", validateAccessToken, getUserIdValidation, getUserDetailsController);
    // router.post("/createUser", validateAccessToken, addUserValidation, addUserController);
    router.post("/createUser", validateAccessToken, addUserController);

    /// grants
    router.post("/addGrant", validateAccessToken, addGrantValidation, addGrantController);
    router.get("/getAllGrant", validateAccessToken, getAllGrantValidation, getAllGrantController);
    router.post("/updateGrant", validateAccessToken, updateGrantValidation, updateGrantController);
    router.get("/getGrantDetails", validateAccessToken, getGrantDetailValidation, getGrantDetailsController);
    router.get("/getJuryByGrantId", validateAccessToken, getGrantDetailValidation, getJuryByGrantIdController);

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

    // grant assign
    router.post("/assignGrantToJury", validateAccessToken, assignGrantToJuryValidator, assignGrantToJuryController);

    // submit grant for artist
    // router.post("/submitGrant", validateAccessToken, submitGrantValidation, submitGrantController);
    router.post("/submitGrant", validateAccessToken, submitGrantController);
    router.get("/getSubmitGrantDetail", validateAccessToken, getSubmitGrantDetailValidation, getSubmitGrantDetailController);
    router.post("/updateSubmitGrantDetail", validateAccessToken, updateSubmitedGrantController);
    router.post("/getAllGrantSubmission", validateAccessToken, getAllGrantSubmissionValidator, getAllGrantSubmissionController);


    // transaction grant for artist
    router.post("/addTransaction", validateAccessToken, addTransactionValidation, addTransactionController);
    router.get("/getTransaction", validateAccessToken, submitGrantController);
    router.post("/updateTransaction", validateAccessToken, updateTransactionValidation, updateTransactionController);
    router.get("/getAllTransactions", validateAccessToken, getAllTransactionValidation, getAllTransactionsController);
    // router.get("/getAllTransactions", validateAccessToken, getAllTransactionsController);


    app.use('/api/v1', router)
}