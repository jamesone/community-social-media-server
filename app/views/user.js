var User = require('../models').user;
var Photo = require('../models').photo;
var Token = require('../models').authTokens;
var models = require('../models');
var Sequelize = require('sequelize');
var sha256 = require('sha256');
var FB = require('fb');
var CryptoJS = require("crypto-js");
var hat = require('hat');

// var checkForeignKey = require('../validation/checkForeignKey.js');

user = {
	loginOrRegister: function(req, res) {

		// Grab the Facebook token, if valid then create OR find user, if user exists or is created, then create token, pass back token and user obj to client
		user.grabFBtokenData(req.body.userId, req.body.fb_token, function(data) {
			if (data.error) {
				console.log ("Error grabbing FB details", data.error);
				// Create user ...
				res.status(201).json({
					"error": "Try again, FB authentication failed",
					"fb_error": "Try login again and accept the permissions",
					"status": 201
				});
				return;
			}

			// Create the user and return access token
			user.insertUser({
				name: data.name,
				email: data.email,
				userId: data.id,
			}, function (token, user) {
				res.status(201).json(JSON.stringify({
					"success": "logged in",
					"token": token,
					user
				}));
			});
		});
	},

	findAll: function(){
		User.findAll({
			include: [
	            { model: Photo  }
	        ]
		}).then(function(users){
			console.log(users);
			// callback(users);
		}).catch(function(err){
			console.log(err);
		});
	},

	findById: function(req){
		User.findById(req.userId).then(function(users){
			console.log("Found by ID:  ", users);
		});
	},

	// Query the authtoken we recieved on login
	grabFBtokenData: function(userId,tok, cb) {
		FB.api('me', { fields: ['id', 'name', 'email',], access_token: tok }, function (res) {
		  console.log("\n\nFB details: \nUser: ", res);
		  console.log("User ID: ", res.id);
		  console.log("User Name: ", res.name);

		  cb(res); // Passback the returned dat
		});

	},

	// Insert the user and get an auth token
	insertUser: function(details, cb){

		// User.find(
		// {where: {
		// 	fbId: details.userId
		// },
		// }).then(function(new_user){
		// 	if (!new_user) {
		// 		User.create({
		// 			fbId: details.userId,
		// 			name: details.name,
		// 			email: details.email,
		// 			authKey: "$$$Ddjjdafjjadsfjadsjfjadfsj2", // Probs will be removed? no need just gonna leave for now.
		// 		}
		// 		// attributes: ['userId', 'name', 'email', 'profilePic'])
		// 		)
		// 		.then(function(new_user){
		// 			user.createTokenForUser(new_user.userId, function(token) {
		// 				cb(token, new_user);
		// 			});
		// 			return;
		// 		});
		// 	}

		// 	user.createTokenForUser(new_user.userId, function(token) {
		// 		cb(token, new_user);
		// 	});
		// });

		User.findOrCreate({
			where: {
				fbId: details.userId,
			},	
			defaults: {
				name: details.name,
				email: details.email,
				authKey: "$$$Ddjjdafjjadsfjadsjfjadfsj2", // Probs will be removed? no need just gonna leave for now.
			},
			attributes: ['userId', 'name', 'email', 'profilePic'],
		}).spread(function (new_user, created) {
			console.log("\n\nUser has been found or created...new user was created: ", created);
			
			// Create the token and then pass it back to our callback along with the user details
			user.createTokenForUser(new_user.userId, function(token) {
				cb(token, new_user);
			});
		}).catch(function (err) {
			console.log("\n\n", err);
		});	
	},

	// User has already been created now create an authToken and return it to CB
	createTokenForUser: function(userId, cb) {
		Token.create({ 
			userId: userId,
			token: genToken()
		}).then (function(token) {
			console.log("\n\nToken is being generated ");
			cb(token.token); // Pass the token back to callback
		}).catch(function(err){
			console.log(err);
		})
		
	},

}

// private method
function genToken() {
    // console.log(CryptoJS.SHA256(hat()).toString());
    return CryptoJS.SHA256(hat()).toString();
}

module.exports = user;