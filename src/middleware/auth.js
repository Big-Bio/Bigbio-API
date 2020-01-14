const jwt = require('jsonwebtoken');
const sequelize = require('sequelize')
const permissions = require('./permissions')
require('dotenv').config();

//get and return token from header, returns null if none exists in header
function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}
//unpacks and returns jswt, return false if unable to extract
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
    //middleware verifying if user is logged in
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