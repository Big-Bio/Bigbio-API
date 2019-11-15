/* GLOBAL ROUTES */

const express = require('express');
const user = require("./components/user/routes")
const register = require('./components/register/routes')

const router = express.Router()

router.use('/user', user)
router.use('/register', register)


module.exports = router