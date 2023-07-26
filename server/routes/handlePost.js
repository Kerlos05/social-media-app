const express = require('express');
const router = express.Router();
const {handleNewPost, handleGetPosts, handleAddComment, handleDeletePost} = require('../controllers/handlePostController');

router.post('/', handleNewPost);
router.put('/', handleAddComment); 
router.get('/', handleGetPosts);
router.delete('/', handleDeletePost)

module.exports = router;