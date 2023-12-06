const express = require('express')
const router = express.Router();
const Controller = require('./controller')

router.post('/signup', Controller.signup)
router.post('/login', Controller.login)
router.post('/registerACRResult', Controller.registerACRResult)
router.post('/getUsers', Controller.getUsers);
router.post('/getACRResults', Controller.getACRResults);
router.post('/getACRDetails', Controller.getACRDetails);
router.post('/getACRDetailsByDate', Controller.getACRDetailsByDate);
router.post('/getACRDetailsByDateTimeslot', Controller.getACRDetailsByDateTimeslot);

module.exports = router;