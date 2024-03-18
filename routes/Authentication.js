const express = require('express');
const AuthenticatioController  = require('../controller/AuthenticatioController')
const router = express.Router();

router.post('/signup', AuthenticatioController.signup)
router.post('/login', AuthenticatioController.login)

module.exports = router;