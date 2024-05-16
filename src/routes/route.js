const router = require("express").Router();
// Post
const { addAdminController } = require('../controller/addAdminController')
const { updateAdminController } = require("../controller/updateAdminController");
const { deleteAdminController } = require("../controller/deleteAdminController");

// Get
const { getAdminController } = require('../controller/getAdminController');
const { adminLoginController } = require("../controller/adminLoginController");
const { validateAccessToken, adminLoginValidation, addAdminValidator } = require("../validations/accessTokenValidation");

module.exports = app => {
    router.get("/adminLogin", adminLoginValidation,  adminLoginController);
    router.post("/addAdmin", validateAccessToken, addAdminValidator, addAdminController);
    router.get("/getAllAdmin", validateAccessToken, getAdminController)
    router.post("/updateAdmin", validateAccessToken, updateAdminController);
    router.post("/deleteAdmin", validateAccessToken, deleteAdminController);


    app.use('/api/v1', router)
}