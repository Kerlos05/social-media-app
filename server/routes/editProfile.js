const express = require('express');
const router = express.Router();
const updateUsernameController = require('../controllers/editProfileController');

router.put('/', updateUsernameController);

module.exports = router;