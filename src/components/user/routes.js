const express = require('express')
const router = express.Router()
const controller = require('./controller')

// router.post('/', controller.user_login)

// router.post('/signup', controller.signup)

// router.get('/', auth.verify, (req, res) => {
//     res.send('yes')
// })

router.post('/login', controller.login)
router.post('/signup', controller.signup)
router.post('/register', controller.register)
router.post('/verify', controller.verify)
router.get('/key', controller.checkKey)

module.exports = router