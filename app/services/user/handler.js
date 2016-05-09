var hat = require('hat');
var Controller = require('./controller');
var {determineError,} = require('./errors');
const {returnLogin, } = require('./views');
const {grabFBtokenData} = require('./external');

const utils = require('./util');
const arrayify = utils.arrayifyTypeIds;


// node_modules
var url = require("url");
var Sequelize = require('sequelize');
var hat = require('hat');
var fileType = require('file-type');

// TURN INTO A CLASS....ALL OVER THE PLACE
/**
	Handler dispatches controllers which insert data into database, controllers return promises, END promises are 
	handled by views. By end I mean the last promise in the stack...e.g when creating a user we need to grab FB token,
	Then insert user into database, and then finally CREATE A TOKEN AND RETURN IT TO CLIENT.
	Promise errors are handled in the handler.js file
**/

user = {
	loginOrRegister: function(req, res) {
		const {fb_token, userId, permissions, applicationID,} = req.body;

		// Grab FB data that belongs to token, if valid create user, then distribute a token back to client.
		grabFBtokenData(userId, fb_token)
			.then( (data) => user.createUserAndDispatchToken(data, fb_token, res))
			.catch( (err) => {
				console.log ("\n\nError authenticating Facebook token: ", determineError(err));
				res.json(JSON.stringify(determineError(err)));
			});

	},

	// Once the FB token has been authenticated, create a new user in our database, & then return a token to the user.
	createUserAndDispatchToken: function (fbData, fb_token, res) {
		Controller.createUser(fbData, fb_token).spread( (createdUser, created) => {
			// If created, then update details....
			if (!created) {
				Controller.updateUser(fbData, createdUser.userId, fb_token).then (() => user.createTokenForUser (createdUser, res));
			} else 
				user.createTokenForUser (createdUser, res);
		}).catch ( (error) => {
			console.log ("ERROR creating user", error)
		})
	},
	createTokenForUser: function(createdUser, res) {
		Controller.createToken(createdUser.userId)
		.then ((token) => returnLogin(token, createdUser, res)) 
		.catch((err) => res.json(JSON.stringify(determineError(err))))
	}
}



module.exports = user;


// MAYBE USE CLASSES????
// class user {
// 	contructor(req, res) {
// 		this.req = req;
// 		this.res = res;
// 	}

// 	loginOrRegister() {
// 		const {userId, fb_token,} = this.req.body; // Grab data needed to verify user login

// 		// Grab FB data that belongs to token, if valid create user, then distribute a token back to client.
// 		grabFBtokenData(userId, fb_token)
// 			.then( (data) => rhia.createUserAndDispatchToken(data, res))
// 			.catch( (err) => {
// 				console.log ("\n\nError authenticating Facebook token: ", determineError(err));
// 				res.json(JSON.stringify(determineError(err)));
// 			});
// 	}

// 	// Once the FB token has been authenticated, create a new user in our database, & then return a token to the user.
// 	createUserAndDispatchToken (fbData, res) {
// 		Controller.createUser(fbData).spread( (createdUser, created) => {
// 			Controller.createToken(createdUser.userId)
// 			.then ((token) => returnLogin(token, createdUser, res)) 
// 			.catch((err) => res.json(JSON.stringify(determineError(err))))
// 		});
// 	}
// }