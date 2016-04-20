var configModels    = require('../../../config').models;
var Models = require('../../models');
var User = Models.user;
var Token = Models.authTokens;
var CryptoJS = require("crypto-js");
var hat = require('hat');

exports.createUser = function (data){
	// Create the user and return access token
	return User.findOrCreate({
		where: {
			fbId: data.id,
		},	
		defaults: {
			name: data.name,
			fbId: data.id,
			email: data.email,
			authKey: "$$$Ddjjdafjjadsfjadsjfjadfsj2", // Probs will be removed? no need just gonna leave for now.
		},
		attributes: ['userId', 'name', 'email', 'profilePic'],
	});
}

exports.createToken = function (userId) {
	// User has already been created now create an authToken and return it to CB
		return Token.create({ 
			userId: userId,
			token: genToken()
		});
}

function genToken() {
    return CryptoJS.SHA256(hat()).toString();
}