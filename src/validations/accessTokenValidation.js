const jwt = require('jsonwebtoken');
const jwtKeys = require('../constants/jwtKeys');

exports.validateAccessToken = async (req, res, next) => {
    let accessToken = req.headers.authorization;
    
    if(accessToken == undefined || accessToken === ""){
        return res.status(401).send({
            success: false,
            message: "Invalid access token.",
          });
    }

    // verify token
    const verified = jwt.verify(accessToken, jwtKeys.JWT_SECRET_KEY);

    if(verified.exp > Date.now()){
        return res.status(401).send({
            success: false,
            message: "Invalid access token.",
          });
    }else{
        next();
    }
}
