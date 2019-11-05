const jwt = require('jsonwebtoken');
require('dotenv').config();

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

async function extract(token){
    try{
        const authData = await jwt.verify(token, process.env.JWT_SECRET);
        return authData;
    }
    catch{
        throw 'Error in extracting token'
    }
}

module.exports = {
    //creates JSWT
    sign: (data) => {return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '12h' })},
    //middleware that grabs token
    verify: (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token == null) {
            res.sendStatus(403);
        }
        else {
            try{
                extract(token)
                req.token = token;
                next();
            }
            catch{
                res.sendStatus(403);
            }
        }
    },
    //checks if valid token
    extract: extract
}