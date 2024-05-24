exports.assignGrantToJuryValidator = (req, res, next) => {
    const { jury_id, grant_id, admin_id } = req.body;
    if (jury_id == undefined || jury_id === "") {
        return res.status(500).send({
            success: false,
            message: "jury_id can not be Empty",
        });
    }
    if (grant_id == undefined || grant_id === "") {
        return res.status(500).send({
            success: false,
            message: "grant_id can not be Empty",
        });
    }
    if (admin_id == undefined && admin_id === "") {
        return res.status(500).send({
            success: false,
            message: "admin_id can not be Empty",
        });
    }
    next();
}