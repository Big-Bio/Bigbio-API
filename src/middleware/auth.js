const jwt = require('jsonwebtoken');
const User = require('../components/user/models')
const UserRole = require('./permissions')
require('dotenv').config()

//get and return token from header, returns null if none exists in header
function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

async function verify(req, res, next){
    const token = getTokenFromHeader(req);
    if (token == null) { res.sendStatus(403); return }
    try {
        const result = jwt.verify(token, process.env.SECRET)
        req.token = result
        next()
    }
    catch (e) {
        res.status(400).json({ msg: 'Invalid token' })
    }
}

module.exports = {
    //verify if valid token
    verify: verify,
    can: (perm) => {
        return User.findOne({
            attributes: [],
            where: { user_id: req.token.user_id },
            include: [{ model: UserRole, as: 'role', attributes: [perm] }]
        })
        .then((user) => {
            if(!user.role[perm]){ throw 'Not allowed' }
            else{
                return (req, res, next) => { next() }
            }
        })
        .catch(() => res.status(400).json({msg: 'Invalid entry'}))
    },
    notLoggedIn: (req, res, next)=>{
        const token = getTokenFromHeader(req);
        console.log(token)
        if (token == null) { next(); }
        else{
            try {
                const result = jwt.verify(token, process.env.SECRET)
                res.status(200).json({ msg: 'User already logged in' })
            }
            catch (e) {
                next();
            }
        }
    }
}