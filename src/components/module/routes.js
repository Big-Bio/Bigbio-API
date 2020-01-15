const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')


router.get('', controller.getPublished)
router.get('/getRecent', auth.verify, controller.getRecent)

router.get('/load', auth.verify, controller.load)
router.post('/save', auth.verify, controller.save)
router.post('/submit', auth.verify, controller.submit)

router.post('/publish', controller.publish)
module.exports = router