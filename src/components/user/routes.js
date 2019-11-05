const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.post('/', controller.user_login)

module.exports = router