const express = require('express');
const router = express.Router();
const Handler = require('./handler'); // Handle request, manipulate data etc...

// GET
router.get('/:city/', Handler.findAll);

// POST
router.post('/', Handler.createPost);
router.post('/like', Handler.togglePostLike);


module.exports = router;