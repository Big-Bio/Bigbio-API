const service_path = '../../services'
const sql = require(service_path + '/sql')
const hash = require(service_path + '/hash')
const token = require(service_path + '/jswb')
const joi = require('joi');
const model = require('./models')

module.exports = {
    user_login: (req,res) => {
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
            .then((key) => res.json({ status: true, token: key }))
            .catch((err) => { res.status(404).json({ status: false, error: err }) })
    },
    register: (req,res) => {

    }
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
        const data = await model.login.findOne({ where: { username: username } })
        if(data == null){
            throw 'err'
        }
        return data
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