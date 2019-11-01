const service_path = '../../services'
const sql = require(service_path + '/sql')
const hash = require(service_path + '/hash')
const token = require(service_path + '/jswb')
const joi = require('joi');

//
function user_login(req, res){
    const schema = joi.object().keys({
        username: joi.string().trim().required(),
        password: joi.string().min(0).max(20).required()
    });
    const username = req.body.username
    const password = req.body.password

    validateInput(req.body, schema)
    .then(() => getUserInfo(username))
    .then((data) => comparePass(password, data))
    .then((data) => MakeToken(data))
    .then((key) => res.json({status: true, token: key}))
    .catch((err) => { res.status(400).json({status: false, error: err}) })
}

module.exports = {
    user_login: user_login
}

async function validateInput(body, schema) {
    try {
        await joi.validate(body, schema)
    }
    catch (e) {
        throw e.details[0].message
    }
}

async function getUserInfo(username) {
    try {
        const data = await sql.query("SELECT user_ID, username, password FROM Users WHERE username = ?", username)
        if (data.length == 0) {
            throw 'error'
        }
        return data[0]
    }
    catch{
        throw 'Invalid username'
    }
}

async function comparePass(password, data) {
    const verified = await hash.compare(password, data.password)
    if (verified) {
        return JSON.parse(JSON.stringify(data))
    }
    else {
        throw 'Invalid password'
    }
}

async function MakeToken(data) {
    return token.sign({ user_ID: data.user_ID, username: data.username })
}