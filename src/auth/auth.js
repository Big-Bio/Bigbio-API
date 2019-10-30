const bcrypt = require('bcrypt');
const mysql = require('../db/mysql');
const Joi = require('joi');
require('dotenv').config();

module.exports = {
    hash: async (password) => {
        return bcrypt.hash(password, process.env.SALT_ROUNDS);
    },
    checkUser: async (username, password) => {
        //checks if username is exists and if so grabs password
        const query = await mysql.executeQuery('SELECT email,user_ID,password FROM Users WHERE username=? LIMIT 1', username);
        if(query.length != 1){
            throw {
                messsage: 'user_not_found',
                success: false
            };
        }
        const data = query[0];
        const hashPass = data.password;
        //compares input password with database password
        const match = await bcrypt.compare(password, hashPass);
        if(match){
            return {
                user_id: data.user_ID,
                username: username,
                email: data.email
            }
        }
        else{
            throw {
                messsage: 'incorrect_password',
                success: false
            };
        }
    },
    //check if input meets requirements
    validate: async (req) => {
        const schema = Joi.object().keys({
            username: Joi.string().trim().required(),
            password: Joi.string().min(0).max(20).required()
        });
            
        return Joi.validate(req.body, schema)
            .catch((err) => {
                throw err.details[0].message;
            })
        }
}