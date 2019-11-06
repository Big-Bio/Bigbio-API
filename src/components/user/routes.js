const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')

router.post('/', controller.user_login)

router.post('/signup', controller.signup)

router.get('/', auth.verify, (req, res) => {
    res.send('yes')
})

module.exports = router