const bcrypt = require('bcrypt')
require('dotenv').config()

module.exports = {
    password: (password) => {
        return bcrypt.hash(password, process.env.SALT_ROUNDS);
    },
    compare: bcrypt.compare

}