var express = require('express');
var router = express.Router();
var postType = require('../views/postType');
var Locations = require('../views/city');


var Auth = require('./auth');

router.get('/find', postType.findAll);
router.get('/all', Locations.findAll);



module.exports = router;
