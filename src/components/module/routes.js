const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')


//user routes
router.get('', controller.getSinglePublished)
router.get('/getPublished', controller.getRecentPublished)
router.get('/getRecent', auth.verify, controller.getRecent)
router.get('/load', auth.verify, controller.load)
router.post('/save', auth.verify, controller.save)
router.post('/submit', auth.verify, controller.submit)

//admin routes
router.post('/publish', auth.verify, controller.publish)
module.exports = router