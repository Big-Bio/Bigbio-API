const sequelize = require('sequelize')
const db = require('../../config/db')
const md5 = require('md5')

const Email = db.define('Emails', {
    email: { type: sequelize.STRING },
    vkey: { type: sequelize.STRING },
}, { timestamps: false })

Email.insert = async (email) => {
    const vkey = md5(email + Date())
    if ((await Email.findOrCreate({ where: { email: email }, defaults: { vkey: vkey } }))[1])
        return vkey
    else
        return false
}

module.exports = {
    Email: Email
}