const express = require('express');
const router = express.Router();
const {handleNewFriend, handleDeleteFriend, handleGetFriend} = require('../controllers/handleFriendsController');

router.post('/', handleNewFriend);
router.get('/:username', handleGetFriend);
router.delete('/', handleDeleteFriend);

module.exports = router;