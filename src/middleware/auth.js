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

module.exports = {
    //verify if valid token
    verify: async (req, res, next) => {
        const token = getTokenFromHeader(req);
        if (token == null) { res.sendStatus(403); return }
        try{
            const result = jwt.verify(token, process.env.SECRET)
            req.token = result
            next()
        }
        catch(e){
            res.status(400).json({ msg: 'Invalid token' }) 
        }
    }
}