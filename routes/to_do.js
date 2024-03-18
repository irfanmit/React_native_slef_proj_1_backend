const express = require('express');
const to_do_controller = require('../controller/to_do')
const router = express.Router();

router.get('/to_do_lists/:id', to_do_controller.to_do);

router.post('/togglevent', to_do_controller.toggleEvent )

router.post('/taskDel', to_do_controller.taskDel)

router.post('/addTask', to_do_controller.addTask)

router.post('/editTask', to_do_controller.editTask)

module.exports = router;