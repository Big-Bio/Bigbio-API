const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    verify: async (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token == null) {
            res.sendStatus(403);
        }
        else {
            try {
                req.token = await extract(token)
                next();
            }
            catch{
                res.status(400).json({status: false, error: 'Invalid token'});
            }
        }
    }
}

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

async function extract(token) {
    try {
        const authData = await jwt.verify(token, process.env.SECRET);
        return authData;
    }
    catch(e){
        throw 'Error in extracting token'
    }
}