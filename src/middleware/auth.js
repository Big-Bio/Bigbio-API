const jwt = require('jsonwebtoken');
const User = require('../components/user/models')
const UserRole = require('./permissions')
require('dotenv').config()

const userCan = function (perm, user_id) {
    return User.findOne({
        attributes: [],
        where: { user_id: user_id },
        include: [{ model: UserRole, as: 'role', attributes: [perm] }]
    })
    .then((user) => { return user.role[perm] })
    .catch((e) => { return false })
}

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
    },
    can: (req, res, next) => {
        
    }
}