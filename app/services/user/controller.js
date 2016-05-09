var configModels    = require('../../../config').models;
var Models = require('../../models');
var User = Models.user;
var Token = Models.authTokens;
var CryptoJS = require("crypto-js");
var hat = require('hat');

exports.createUser = function (data, fb_token){
	const {picture, cover,} = data;
	console.log (picture.data.url, "<!!~~~ PICTURE <~~~~~!!");
	console.log (cover.source, "<!!~~~ COVER <~~~~~!!");

	// Create the user and return access token
	return User.findOrCreate({
		where: {
			fbId: data.id,
		},	
		defaults: {
			name: data.name,
			fbId: data.id,
			profilePic: picture.data.url,
			coverPic: cover.source,
			email: data.email,
			authKey: fb_token,
		},
		attributes: ['userId', 'name', 'email', 'profilePic', 'authKey', 'coverPic'], // Pass down fb_token
	});
}

exports.updateUser = (fbData, userId, fb_token) => {
	return User.update({
		name: fbData.name,
		fbId: fbData.id,
		profilePic: fbData.picture.data.url,
		coverPic: fbData.cover.source,
		email: fbData.email,
		authKey: fb_token,
	},
	{where: {userId: userId}}
); //.success( ()=> user.createTokenForUser (createdUser.userId))
}

exports.createToken = function (userId) {
	// User has already been created now create an authToken and return it to CB
	return Token.create({ 
		userId: userId,
		token: genToken() // Used to authenticate on our server
	});
}

function genToken() {
    return CryptoJS.SHA256(hat()).toString();
}