const mysql = require('mysql');
let path = require('path');
const util = require('util')

//Create connection
var pool = mysql.createPool({
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 8888
});

//wraps query into a promise
pool.query = util.promisify(pool.query).bind(pool);

//console log everytime database is being accessed
pool.on('connection', (conn) => {
    console.log('DB connected');
})

module.exports.executeQuery = pool.query;