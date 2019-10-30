const jwt = require('jsonwebtoken');
require('dotenv').config();

function getTokenFromHeader(req){
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

module.exports = {
    //middleware that grabs token
    verifyToken: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token == null) {
            res.sendStatus(403);
        }
        else {
            req.token = token;
            next();
        }
    },
    //creates and returns token
    sign: async (data) => {
        const token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '12h' });
        return token;
    },
    //checks if valid token and returns token with data
    verify: async (token) => {
        const authData = await jwt.verify(token, process.env.JWT_SECRET);
        return authData;
    }
} 


