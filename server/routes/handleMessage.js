const express = require('express');
const router = express.Router();
const handleMessage = require('../controllers/handleMessageController');

router.post('/', handleMessage.sendMessage);
router.put('/', handleMessage.getAllMessages);
router.delete('/', handleMessage.deleteMessage);

module.exports = router;