const jwt = require('jsonwebtoken');
const jwtKeys = require('./jwtKeys');

exports.createAccessToken = (tokenData) => {
    const token = jwt.sign({ user: tokenData }, jwtKeys.JWT_SECRET_KEY, { expiresIn: '36500d' }); // 36500 days = 100 Years
    return token;
}