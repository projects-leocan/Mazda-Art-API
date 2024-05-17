exports.addMODValidation = (req, res, next) => {
    const { mod_value, admin_id } = req.body;
    if (mod_value == undefined || mod_value === "") {
        return res.status(500).send({
            success: false,
            message: "Medium of Choice can not be Empty",
        })
    }
    if (admin_id == undefined || admin_id === "") {
        return res.status(500).send({
            success: false,
            message: "Admin id can not be Empty",
        })
    }
    next();
}

exports.updateMODValidation = (req, res, next) => {
    const { mod_id, mod_value, admin_id } = req.body;
    if (mod_id == undefined || mod_id === "") {
        return res.status(500).send({
            success: false,
            message: "Medium of Choice id can not be Empty",
        })
    }
    if (mod_value == undefined || mod_value === "") {
        return res.status(500).send({
            success: false,
            message: "Medium of Choice can not be Empty",
        })
    }
    if (admin_id == undefined || admin_id === "") {
        return res.status(500).send({
            success: false,
            message: "Admin id can not be Empty",
        })
    }
    next();
}
