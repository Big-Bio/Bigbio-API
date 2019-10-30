let express = require('express');
let router = express.Router();
const path = require('path');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Token = require('../auth/token');
const User = require('../controllers/user');
const Login = require('../controllers/login');
const Register = require('../controllers/register');

//USER
router.get('/user', Token.verifyToken, User.getAll);
//Params prop on request object
router.get('/user/:username', User.get);

//LOGIN
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/test.html'));
})
router.post('/login', Login.process);

//Register
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/test.html'))
})
router.post('/register', Register.process);

module.exports = router;