const express = require('express')
const router = express.Router()
const controller = require('./controller')
const auth = require('../../middleware/auth')

//open routes
router.get('', controller.getSinglePublished)
router.get('/getPublished', controller.getRecentPublished)
router.get('/treeData', controller.getTreeData)

//user routes
router.get('/getRecent', auth.verify, controller.getRecent)
router.get('/load', auth.verify, controller.load)
router.post('/save', auth.verify, controller.save)
router.post('/submit', auth.verify, controller.submit)


//admin routes
router.post('/publish', auth.verify, auth.isAdmin, controller.publish)
router.get('/getSubmitted', auth.verify, auth.isAdmin, controller.getSubmitted)
module.exports = router