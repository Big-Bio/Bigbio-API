const sequelize = require('sequelize')
const db = require('../../services/db')

module.exports = {
    login: db.define('Users', {
        username: sequelize.STRING,
        password: sequelize.STRING,
        user_ID: {
            type: sequelize.INTEGER,
            primaryKey: true
        }
    }, {
            timestamps: false,
    }),

}