const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const controller = require('./controller')

router.post('/', controller)

module.exports = router

