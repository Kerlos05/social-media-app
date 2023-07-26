const express = require('express');
const router = express.Router();
const removeUser = require('../controllers/deleteUserController'); 

router.delete('/', removeUser.removeUser); 

module.exports = router;