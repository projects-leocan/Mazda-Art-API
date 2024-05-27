const jwt = require('jsonwebtoken');
const jwtKeys = require('./jwtKeys');

exports.createAccessToken = (tokenData) => {
    const token = jwt.sign({ user: tokenData }, jwtKeys.JWT_SECRET_KEY, { expiresIn: '3650d' }); // 3650 days = 10 Years
    return token;
}