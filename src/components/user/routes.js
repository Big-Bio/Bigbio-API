const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')

// router.post('/', controller.user_login)

// router.post('/signup', controller.signup)

// router.get('/', auth.verify, (req, res) => {
//     res.send('yes')
// })

router.post('/login', auth.notLoggedIn, controller.login)
router.post('/signup', auth.notLoggedIn, controller.signup)
router.post('/register', auth.notLoggedIn, controller.register)
router.post('/verify', auth.verify, controller.verify)
router.get('/key', controller.checkKey)

module.exports = router