const express = require('express');
const router = express.Router();
const Handler = require('./handler'); // Handle request, manipulate data etc...

// POST
router.post('/', Handler.insertComment); // Insert comment into :postId

// GET
router.get('/', Handler.findByPostId); // Grab comments for :postId


module.exports = router;