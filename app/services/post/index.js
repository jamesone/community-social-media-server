const express = require('express');
const router = express.Router();
const Handler = require('./handler'); // Handle request, manipulate data etc...

// GET
router.get('/:city/', Handler.findAll);

// POST
router.post('/', Handler.createPost);
router.post('/like', Handler.togglePostLike);
// router.post('/like/:postId', Handler.likePost);


module.exports = router;