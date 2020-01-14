/* GLOBAL ROUTES */
const express = require('express');
const User = require("./components/user/routes")
const Module = require("./components/module/routes")
const Test = require('./components/test/routes')

const router = express.Router()

router.use('/user', User)
router.use('/module', Module)
router.use('/test', Test)


module.exports = router