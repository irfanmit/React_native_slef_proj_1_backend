const express = require('express');
const MessageController  = require('../controller/MessageContoller')
const router = express.Router();

router.post('/addMessage', MessageController.addMsg );
router.post('/getMessage', MessageController.getMsg);

module.exports = router;