const db = require('../config/db')
const sequelize = require('sequelize')
const User = require('../components/user/models')

const Perm = db.define('user_roles', {
    role_id: { type: sequelize.INTEGER, primaryKey: true},
    name: { type: sequelize.STRING },
    apply_contributor: { type: sequelize.BOOLEAN },
    build_modules: { type: sequelize.BOOLEAN },
    edit_modules: { type: sequelize.BOOLEAN },
    delete_modules: { type: sequelize.BOOLEAN },
    submit_modules: { type: sequelize.BOOLEAN },
    super_edit_modules: { type: sequelize.BOOLEAN },
    super_delete_modules: { type: sequelize.BOOLEAN },
    publish_modules: { type: sequelize.BOOLEAN },
}, { timestamps: false })

module.exports = Perm;
