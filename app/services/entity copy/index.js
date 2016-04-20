const express = require('express');
const router = express.Router();
const Handler = require('./handler'); // Handle request, manipulate data etc...

// POST
router.post('/post/', Handler.togglePostLike); // Like or unlike post


module.exports = router;