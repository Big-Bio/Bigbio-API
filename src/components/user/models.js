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
    register: db.define('Users', 

    )

}