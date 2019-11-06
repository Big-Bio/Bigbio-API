const sequelize = require('sequelize')
const db = require('../../services/db')

module.exports = {
    login: db.define('Users', {
        username: {
            type: sequelize.STRING,
        },
        password: {
            type: sequelize.STRING,
        },
        user_ID: {
            type: sequelize.INTEGER,
            primaryKey: true
        }
    }, {
            timestamps: false,
    }),

    signup: db.define('Emails', {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        vkey: {
            type: sequelize.STRING
        },
        date: {
            type: sequelize.DATE,
            defaultValue: sequelize.NOW
        },
    }, {
        timestamps: false
    })

}