const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.get('/', (req,res) => {
    res.send('Welcome to Component: User')
})

router.post('/', controller.user_login)

module.exports = router