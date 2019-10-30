const mysql = require('../db/mysql');
const auth = require('../auth/auth');

module.exports = {
    process: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        const hashPass = await auth.hash(password);
        var stmt = 'INSERT INTO Users(username, password, user_ID) VALUES(?,?,3)';
        result = await mysql.executeQuery(stmt,[username, hashPass])
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        })
    }
}