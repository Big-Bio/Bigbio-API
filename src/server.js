const express = require('express')
const logger = require('morgan')
const bodyParser = require("body-parser")
const db = require('./config/db')
var cors = require('cors')
require('dotenv').config()

const PORT = 2000
const app = express()

Date.prototype.toJSON = function () { return this.toLocaleString(); }

app.use(logger('dev'));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//start database
db.authenticate()
.then(() => console.log('Database connected...'))
.catch((err) => console.log(err))

//Route Handler
app.use(require('./routes'))

//Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    // res.status('404').sendFile(path.join(__dirname, '/public/404.html'))
    res.status('404').send('404')
})

//Handler for 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    // res.status('500').sendFile(path.join(__dirname, '/public/500.html'))
    res.status(500).send('500')
})

app.listen(PORT, () => console.log(`Server ${PORT} has started.`))