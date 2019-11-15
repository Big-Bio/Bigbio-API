const sequelize = require('sequelize')
const db = require('../../config/db')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = db.define('Users', {
    user_ID: { type: sequelize.INTEGER, primaryKey: true },
    username: { type: sequelize.STRING },
    password: { type: sequelize.STRING },
    email: { type: sequelize.STRING } 
}, { timestamps: false })

User.prototype.generateJWT = function () {
    return jwt.sign({ user_id: this.user_ID, username: this.username, email: this.email }, process.env.SECRET, { expiresIn: '5h' })
}

User.prototype.validatePassword = async function (password) {
    return await brcypt.compare(password, this.password)
}

module.exports = User