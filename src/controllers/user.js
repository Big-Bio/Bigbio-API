const mysql = require('../db/mysql');
const auth = require('../auth/auth');
const jwt = require('../auth/token');

module.exports = {
    //gets all usernames
    getAll: async (req, res) => {
        try{
            var token = await jwt.verify(req.token);
            const stmt = 'SELECT username,password FROM Users';
            const result = await mysql.executeQuery(stmt);
            res.json({
                token: token,
                data: result
            });
        }
        catch(err){
            res.send(err);
        } 
    },
    //gets specific user
    get: async (req, res) => {
        const stmt = 'SELECT first_name, last_name, email FROM Users WHERE username=? LIMIT 1';
        const result = await mysql.executeQuery(stmt,req.params.username);
        res.send(result);
    },
}