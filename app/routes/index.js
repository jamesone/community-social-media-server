var express = require('express');
var router = express.Router();
var postType = require('../views/postType');
var Locations = require('../views/city');


var Auth = require('./auth');

router.get('/category', postType.findAll);
router.get('/cities', Locations.findAll);



module.exports = router;
