const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    //creates JSWT
    sign: (data) => {return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '12h' })}
}