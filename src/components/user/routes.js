const express = require('express')
const router = express.Router()
const controller = require('./controller')

// router.post('/', controller.user_login)

// router.post('/signup', controller.signup)

// router.get('/', auth.verify, (req, res) => {
//     res.send('yes')
// })

router.post('/login', controller.login)

module.exports = router