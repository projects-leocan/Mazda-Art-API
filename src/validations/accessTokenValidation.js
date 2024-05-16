const jwt = require('jsonwebtoken');
const jwtKeys = require('../constants/jwtKeys');

exports.validateAccessToken = async (req, res, next) => {
    let accessToken = req.headers.authorization;

    if (accessToken == undefined || accessToken === "") {
        return res.status(401).send({
            success: false,
            message: "Invalid access token.",
        });
    }

    // verify token
    const verified = jwt.verify(accessToken, jwtKeys.JWT_SECRET_KEY);

    if (verified.exp > Date.now()) {
        return res.status(401).send({
            success: false,
            message: "Invalid access token.",
        });
    } else {
        next();
    }
}


exports.adminLoginValidation = (req, res, next) => {
    const { admin_email, admin_password } = req.query;

    console.log("adminLoginValidation called !!!!!!!!!");

    if (admin_email === undefined || admin_email === "") {
        return res.status(500).send({
            success: false,
            message: "Invalid email address",
        });
    }
    if (admin_password === undefined || admin_password === "") {
        return res.status(500).send({
            success: false,
            message: "Invalid password",
        });
    }

    next();
}

exports.addAdminValidator = (req, res, next) => {
    const { admin_name, admin_email, admin_password, admin_contact, admin_address } = req.body;

    if (admin_email === undefined || admin_email === "") {
        return res.status(500).send({
            success: false,
            message: "Invalid email address",
        });
    }
    if (admin_password === undefined || admin_password === "") {
        return res.status(500).send({
            success: false,
            message: "Invalid password",
        });
    }

    next();
}
