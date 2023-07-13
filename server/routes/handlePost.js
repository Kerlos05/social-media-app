const express = require('express');
const router = express.Router();
const {handleNewPost, handleGetPosts} = require('../controllers/handlePostController');

router.post('/', handleNewPost);
router.get('/', handleGetPosts);

module.exports = router;