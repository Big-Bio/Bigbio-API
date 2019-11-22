const sequelize = require('sequelize')
const db = require('../../config/db')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

const User = db.define('users', {
    user_id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    email: { type: sequelize.STRING, validate: { isEmail: true } },
    username: { type: sequelize.STRING, validate: { 
        is: { args: ["^[A-Za-z0-9]+$", 'i'], msg: 'Invalid Username'}, 
        notEmpty: {msg: 'Username cannot be empty'} 
    }},
    password: { type: sequelize.STRING, validate: {
        notEmpty: { msg: 'Password cannot be empty' }
    }},
    logged_at: { type: sequelize.DATE },
    created_at: { type: sequelize.DATE },
    registered: { type: sequelize.BOOLEAN },
    vkey: { type: sequelize.STRING }
}, { timestamps: false })

User.prototype.generateJWT = function () {
    return jwt.sign({ user_id: this.user_ID, username: this.username, email: this.email }, process.env.SECRET, { expiresIn: '5h' })
}

User.prototype.validatePassword = async function (password) {
    return await brcypt.compare(password, this.password)
}

User.prototype.register = async function (username, password, vkey) {
    return (await User.update(
        { username: username, password: password, registered: true },
        { where: {vkey: vkey, registered: false}}
    ))[0]
}

User.signup = async function (email) {
    const vkey = md5(email + Date())
    const query = await User.findOrCreate({ where: { email: email }, defaults: { vkey: vkey } })
    if (query[1] === false)
        throw 'Invalid email'
    return vkey
}

const User_data = db.define('users_data', {
    user_id: { type: sequelize.INTEGER },
    first_name: { type: sequelize.STRING },
    last_name: { type: sequelize.STRING },
    age: { type: sequelize.TINYINT },
    gender: { type: sequelize.STRING },
    ethnicity: { type: sequelize.STRING },
    country: { type: sequelize.STRING },
    state: { type: sequelize.STRING },
    highest_degree_earned: { type: sequelize.STRING },
    years_schooling: { type: sequelize.STRING },
    rank_bio: { type: sequelize.TINYINT },
    rank_stats: { type: sequelize.TINYINT },
    rank_cs: { type: sequelize.TINYINT },
    reason: { type: sequelize.STRING },
    occupation: { type: sequelize.STRING },
    employer: { type: sequelize.STRING },
    primary_field: { type: sequelize.STRING },
    profile_url: { type: sequelize.STRING }
}, { timestamps: false })

module.exports = {
    User: User
}