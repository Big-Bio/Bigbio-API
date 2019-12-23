const jwt = require('jsonwebtoken');
require('dotenv').config();



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
        return false
    }
}

module.exports = {
    verify: async (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token == null) {
            res.sendStatus(403);
        }
        else {
            const process = await extract(token)
            if(process){
                req.token = process
                next();
            }else{
                res.status(400).json({ msg: 'Invalid token' });
            }
        }
    },
    extract: extract
}