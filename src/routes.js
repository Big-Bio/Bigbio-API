/* GLOBAL ROUTES */
const express = require('express');
const user = require("./components/user/routes")
const Module = require("./components/module/routes")

const router = express.Router()

router.use('/user', user)
router.use('/module', Module)

module.exports = router