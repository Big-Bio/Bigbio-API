const express = require('express');
const user = require("./components/user/routes")

const router = express.Router()

router.use('/user', user)


module.exports = router