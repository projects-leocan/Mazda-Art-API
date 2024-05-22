const _ = require("lodash");

exports.addThemeValidation = (req, res, next) => {
    const { theme, admin_id } = req.body;
    if (_.isEmpty(req.body)) {
        return res.status(500).send({
            success: false,
            message: "Pass data in body",
        });
    }
    if (theme === undefined || theme === "") {
        return res.status(500).send({
            success: false,
            message: "theme can not be empty",
        });
    }
    if (admin_id === undefined || admin_id === "") {
        return res.status(500).send({
            success: false,
            message: "admin id can not be empty",
        });
    }
    next();
}

exports.updateThemeValidation = (req, res, next) => {
    const { theme, admin_id, theme_id } = req.body;
    if (_.isEmpty(req.body)) {
        return res.status(500).send({
            success: false,
            message: "Pass data in body",
        });
    }
    if (theme === undefined || theme === "") {
        return res.status(500).send({
            success: false,
            message: "theme can not be empty",
        });
    }
    if (admin_id === undefined || admin_id === "") {
        return res.status(500).send({
            success: false,
            message: "admin id can not be empty",
        });
    }
    if (theme_id === undefined || theme_id === "") {
        return res.status(500).send({
            success: false,
            message: "theme id can not be empty",
        });
    }
    next();
}