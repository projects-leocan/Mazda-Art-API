const router = require("express").Router();
// Insert
const { addAdminController } = require('../controller/addAdminController')
const { updateAdminController } = require("../controller/updateAdminController");
const { deleteAdminController } = require("../controller/deleteAdminController");

// Get
const { getAdminController } = require('../controller/getAdminController');

module.exports = app => {
    router.post("/addAdmin", addAdminController);
    router.get("/getAllAdmin", getAdminController)
    router.post("/updateAdmin", updateAdminController);
    router.post("/deleteAdmin", deleteAdminController);


    app.use('/api/v1', router)
}