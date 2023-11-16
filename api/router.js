const express = require('express')
const router = express.Router();
const Controller = require('./controller')

router.post('/signup', Controller.signup)
router.post('/login', Controller.login)
router.post('/registerACRResult', Controller.registerACRResult)
router.post('/getUsers', Controller.getUsers);
router.post('/getACRResults', Controller.getACRResults);

module.exports = router;