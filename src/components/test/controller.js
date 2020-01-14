const User = require('../user/models')
const UserRole = require('../../middleware/permissions')

const UserCan = function(perm, user_id){
    return User.findOne({
        attributes: [],
        where: { user_id: user_id },
        include: [{ model: UserRole, as: 'role', attributes: [perm] }]
    })
    .then(( user ) => { return user.role[perm] })
    .catch((e) => { return false })
}

const testEnviroment = async function (req, res){
    
    const a = await UserCan('super_delete_modules', 86)
    res.send(a)
}

module.exports = testEnviroment