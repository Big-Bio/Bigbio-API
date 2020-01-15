require('dotenv').config()
const sequelize = require('sequelize')
const db = require('../../config/db')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRole = require('../../middleware/permissions')
const Module = require('../module/models')

const User = db.define('users', {
    user_id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    email: { type: sequelize.STRING },
    username: { type: sequelize.STRING },
    password: { type: sequelize.STRING },
    role_id: { type: sequelize.INTEGER },
    logged_at: { type: sequelize.DATE },
    created_at: { type: sequelize.DATE },
    registered: { type: sequelize.BOOLEAN },
    vkey: { type: sequelize.STRING }
}, { timestamps: false })

//associate permissions with user
User.hasOne(UserRole, {foreignKey: 'role_id', sourceKey: 'role_id', as: 'role'})
Module.hasOne(User, { foreignKey: 'user_id', sourceKey: 'author_id', as: 'user' })
User.hasMany(Module, {foreignKey: 'author_id', sourceKey: 'user_id', as: 'modules' })


//generates and return token with user_id, username, email, role_id
User.prototype.generateJWT = function () {
    return jwt.sign({ user_id: this.user_id, username: this.username, email: this.email, role_id: this.role_id }, process.env.SECRET, { expiresIn: '5h' })
}

//compares hased password with password and returns result
User.prototype.validatePassword = async function (password) {
    return await brcypt.compare(password, this.password)
}

//registers account and inserts username, hash_password
User.prototype.register = async function (username, password) {
    if(await User.exists({username: username})){ throw {msg: 'Username is taken'}}

    const hash_password = await brcypt.hash(password, parseInt(process.env.SALT_ROUNDS))
    this.username = username
    this.password = hash_password
    this.registered = 1
    return this.save().then(() => {return true}).catch(() => {throw 'Register Error'})
}

//returns if user exists depending on params
User.exists = async function (params){
    return User.findOne({where: params })
    .then((result) => { if(result){ return true } else {return false} })
    .catch(() => { throw 'Invalid parameters'})
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

module.exports = User