const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/report/daily', taskController.getDailyReport);
router.get('/report/weekly', taskController.getWeeklyReport);

module.exports = router;
