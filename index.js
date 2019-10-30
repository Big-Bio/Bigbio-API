const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require("body-parser");
require('dotenv').config();

let user = require('./src/routes/router');
let path = require('path');

const PORT = 3000;
const app = express();

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use(user);
app.use(express.static('public'));

//Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status('404').sendFile(path.join(__dirname, '/public/404.html'));
})

//Handler for 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status('500').sendFile(path.join(__dirname, '/public/500.html'));
})

app.listen(PORT, () => console.log(`Server ${PORT} has started.`));