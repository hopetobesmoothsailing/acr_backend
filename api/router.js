const express = require('express')
const router = express.Router();
const Controller = require('./controller')
const multer = require('multer');
// Setup storage engine
const upload = multer({ dest: 'uploads/' });

router.post('/signup', Controller.signup)
router.post('/login', Controller.login)
router.post('/registerACRResult', Controller.registerACRResult)
router.post('/getUsers', Controller.getUsers);
router.post('/getACRResults', Controller.getACRResults);
router.post('/getACRDetailsByDate', Controller.getACRDetailsByDate);
router.post('/getACRDetailsByDateRTV', Controller.getACRDetailsByDateRTV);
router.post('/getACRDetailsByDateTimeslot', Controller.getACRDetailsByDateTimeslot);
router.post('/getResultsByDateAndChannel', Controller.getResultsByDateAndChannel);
router.post('/getPalinsestoByDateAndChannel', Controller.getPalinsestoByDateAndChannel);
router.post('/getUserCountByTime', Controller.getUserCountByTime);
router.post('/getACRDetails', Controller.getACRDetails);
router.post('/sendReminderEmailToInactiveUsers', Controller.sendReminderEmailToInactiveUsers);
router.post('/getAppStatusUsers', Controller.getAppStatusUsers);
router.post('/getAppActivatedUsers', Controller.getAppActivatedUsers);
router.post('/getACRDetailsByDateAndUser', Controller.getACRDetailsByDateAndUser);
router.post('/getExportACRDetailsByDateRTV', Controller.getExportACRDetailsByDateRTV);
router.post('/getCsvByDateRTV', Controller.getCsvByDateRTV);
router.post('/uploadPalinsestom', upload.single('file'), Controller.uploadPalinsestom);
router.post('/getPalinsestomByDateAndChannel', Controller.getPalinsestomByDateAndChannel);
router.post('/getACRDetailsByRangeRTV', Controller.getACRDetailsByRangeRTV);

module.exports = router;