var express = require('express');
var path = require('path');
var ip = require("ip");
var logger = require('morgan');
var bodyParser = require('body-parser');
var faker = require('faker'); // Fake data only


var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/photos', express.static(__dirname + '/media/post_photos'));

// Switch to ngnx later on ...
app.enable('trust proxy')


app.all('/*', function(req, res, next) {
	console.log("\n\nNew request from: ", req.ip);

	// CORS headers
	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	res.header("X-powered-by", "SUPRISE MOTHER F***KER");
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// Forward request to the right services:
app.all('/api/v1/*', [require('./app/middlewares/validateRequest')]); // Authenticate all api/v1/ reqs

app.use('/api/v1/post/', require('./app/services/post/index.js')); 
app.use('/api/v1/comments/', require('./app/services/comment/index.js')); 
app.use('/api/v1/ent/', require('./app/services/entity/index.js')); 
app.use('/user/', require('./app/services/user/index.js')); 
app.use('/category/', require('./app/routes/index.js')); 
app.use('/cities/', require('./app/routes/index.js')); 

// app.use('/user/*', require('./app/services/user/')); 
app.use('/api/v1/', require('./app/routes')); // TEMP UNTIL I IMPLEMENT OWN MICROSERVICE

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// BELOW IS FOR DEV PURPOSES ONLY TO BUILD TEST DATA AND SYNC DATABASE MODELS
var models = require('./app/models'); // ALl of the models... Synce below



module.exports = app;


// // Debug / add fake data
const fakeData = false; // Syncs the DB models, do this when you've made changes (it deletes * data too)
const createData = false; // Creates the fake data when TRUE
const types = ['Traffic Jam', 'Terror Alert', 'Speed Camera', 'Medical Emergency', 'Cheap Fuel', 'Other'];
const locations = ['Victoria', 'NSW', 'QLD', 'South Australia'];

models.sequelize.sync({'force': fakeData}).then(function () {
	/*
		1. create postTypes
		2. create locations
		3. create user/s
		4. create entity/s
		5. create post/s
		6. create comment/s
	*/
	if (createData){
		// Create all the postType/s 
		
		for (var x=0; x<types.length; x++) {
			models.postType.create({
				name: types[x]
			});	
		}

		// Create all the locations
		
		for (var y=0;y<locations.length;y++) {
			models.locations.create({
				name: locations[y],
			});
		}

		createUser(); // Runs the rest...
	}

});



function createUser () {
	var names = ['Dale Dobeck', 'Brennan Huff', 'Matt Damon', 'Dick Weiner', 'Diana Dbag', 'Pete Griffin', 'Derpa Mc\' Derpy'];
	// USER:
	for (var i=0;i<7;i++) {
		models.user.create({
			name: names[i],
			email: faker.internet.email(),
			authKey: "WILLLB3REMOVEDS()()N",
			fbId: 10201729658001612,
		});
	}


	createPost()
}	

function createPost () {
	for(var i=1;i<120;i++){
		var userId = Math.floor((Math.random() * 7) + 1);
		var city = Math.floor((Math.random() * 4) + 1);
		var typeId = Math.floor((Math.random() * 5) + 1);
		var photo = (i%2 == 0) ? `1afb4e49b244679528fdcad6b08e496${typeId}.jpeg` : '';
		// curl -H "Content-Type: application/json" -H "x-access-token:99ff54caff57040ba5654b0e3b1aedfed73da35be2413e783e1be7a885abc1c0" -H "x-key:swag" http://192.168.0.12:3000/api/v1/post/Melbourne/0 | json
		models.post.create({
			description: `User Id: ${userId} 
			& Post Id: ${i}
			& City: ${city}, ${locations[city]}
			& Type Id: ${typeId}
			& Type name: ${types[typeId]}`,
			city: city, // References a state
			// entityId: 2,
			location_address: "Melbourne CBD",
			typeId: typeId,
			photo: "f63d7eb7de520c5c02d6c30bafd1b997.jpeg",
			longitude: "145.0"+Math.floor((Math.random() * 10000) + 1),
			latitude: "-37.8"+Math.floor((Math.random() * 100000) + 1),
			// createdAt: randomDate()
			userId: userId,
		}).then( (s) => {
			createPostLikes(s.postId);
			createComments(s.postId);
		})
		.catch(function(err){
			console.log(err);
			return;
		});
	}

}

// Create X postlikes for each post
function createPostLikes (postId) {
	var noLikes = Math.floor((Math.random() * 30) + 1);
	var userId;
	for (var i=0;i<noLikes;i++) {
		userId = Math.floor((Math.random() * 6) + 1);
		models.postLikes.create({
			userId: userId,
			postId: postId,
		}).then().catch((err)=>console.log(err))
	}
}

function createComments (s) {
	var userId = Math.floor((Math.random() * 6) + 1);
	var noCOmments = Math.floor((Math.random() * 6) + 1);
	for (var i=0;i<noCOmments;i++) {
		models.comment.create({
			postId: s.postId,
			comment: faker.lorem.sentence(),
			userId: userId,
		}).then(function(){

		}).catch(function(err){
			console.log("\n\nError inserting comment data")
		});
	}
}