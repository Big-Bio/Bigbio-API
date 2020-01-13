const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')

router.post('/save', auth.verify, controller.save)
router.post('/submit', controller.submit)
router.get('', controller.get)
router.get('/getRecent', auth.verify, controller.getRecent)
router.post('/publish', controller.publish)
module.exports = router