const router = require("express").Router();
// Post
const { addAdminController } = require('../controller/adminControllers/addAdminController')
const { updateAdminController } = require("../controller/adminControllers/updateAdminController");
const { deleteAdminController } = require("../controller/adminControllers/deleteAdminController");

// Admin controllers
const { getAdminController } = require('../controller/adminControllers/getAdminController');
const { adminLoginController } = require("../controller/adminControllers/adminLoginController");
const { validateAccessToken } = require("../validations/accessTokenValidation");
const { addAdminValidator, adminLoginValidation, adminIdValidator } = require("../validations/adminValidations");

// User controllers
const { getUserProfileValidation, searchUserValidation, getUserDetailValidation } = require("../validations/userValidations");
const { updateUserController } = require("../controller/userControllers/updateUserController");
const { searchUserController } = require("../controller/userControllers/searchUserController");
const { addMODControllers } = require("../controller/mediumOfChoiceControllrs/addMODController");
const { getAllMODControllers } = require("../controller/mediumOfChoiceControllrs/getAllMODControllers");
const { addMODValidation, updateMODValidation } = require("../validations/MODValidations");
const { updateMODController } = require("../controller/mediumOfChoiceControllrs/updateMODController");
const { allUsersController } = require("../controller/userControllers/allUsersController");
const { getUserDetails } = require("../controller/userControllers/getUserDetails");

//theme
const { addThemeController } = require("../controller/theme/addThemeController");
const { getAllThemeController } = require("../controller/theme/getAllThemeController");

// Grant
const { addGrantController } = require("../controller/grant/addGrantController");
const { getAllGrantController } = require("../controller/grant/getAllGrantController");
const { addGrantValidation, updateGrantValidation, getAllGrantValidation } = require("../validations/grantValidations");
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

module.exports = app => {
    // Flow router.type(endpoint, tokenVerify, apiValidations, APIController)

    /// Medium of choices APIs
    router.post("/addMOD", validateAccessToken, addMODValidation, addMODControllers);
    router.get("/getAllMOD", validateAccessToken, getAllMODControllers);
    router.post("/updateMOD", validateAccessToken, updateMODValidation, updateMODController);

    /// admin APIs
    router.get("/adminLogin", adminLoginValidation, adminLoginController);
    router.post("/addAdmin", validateAccessToken, addAdminValidator, addAdminController);
    router.get("/getAllAdmin", validateAccessToken, getAdminController)
    router.post("/updateAdmin", validateAccessToken, adminIdValidator, updateAdminController);
    router.post("/deleteAdmin", validateAccessToken, adminIdValidator, deleteAdminController);

    /// user APIs
    router.get("/getUsers", validateAccessToken, getUserProfileValidation, allUsersController);
    router.get("/searchUser", validateAccessToken, searchUserValidation, searchUserController);
    router.post("/updateUser", validateAccessToken, updateUserController); // update user profile validation is added in controller
    router.get("/getUserDetails", validateAccessToken, getUserDetailValidation, getUserDetails);
    router.post("/createUser", getUserDetailValidation, getUserDetails);

    /// grants
    router.post("/addGrant", validateAccessToken, addGrantValidation, addGrantController);
    router.get("/getAllGrant", validateAccessToken, getAllGrantValidation, getAllGrantController);
    router.post("/updateGrant", validateAccessToken, updateGrantValidation, updateGrantController);

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
    router.post("/assignGrantToJury", assignGrantToJuryValidator, assignGrantToJuryController);


    app.use('/api/v1', router)
}