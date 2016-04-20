const express = require('express');
const router = express.Router();
const Handler = require('./handler'); // Handle request, manipulate data etc...

// GET

// POST
router.post('/login', Handler.loginOrRegister);


module.exports = router;