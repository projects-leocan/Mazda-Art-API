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
const { viewUserProfileController } = require("../controller/userControllers/viewUserProfileController");
const { getUserProfileValidation, searchUserValidation } = require("../validations/userValidations");

module.exports = app => {
    // Flow router.type(endpoint, tokenVerify, apiValidations, APIController)

    /// admin APIs
    router.get("/adminLogin", adminLoginValidation, adminLoginController);
    router.post("/addAdmin", validateAccessToken, addAdminValidator, addAdminController);
    router.get("/getAllAdmin", validateAccessToken, getAdminController)
    router.post("/updateAdmin", validateAccessToken, adminIdValidator, updateAdminController);
    router.post("/deleteAdmin", validateAccessToken, adminIdValidator, deleteAdminController);

    /// user APIs
    router.get("/getUsers", validateAccessToken, getUserProfileValidation, viewUserProfileController);
    router.get("/searchUser", validateAccessToken, searchUserValidation, viewUserProfileController);

    app.use('/api/v1', router)
}