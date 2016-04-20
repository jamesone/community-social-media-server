var FB = require('fb'); // FB API LIB
var Promise = require('promise');


// Query FB server and return promise
exports.grabFBtokenData = function(userId,tok, cb) {
	return new Promise(function (fulfill, reject) {
		FB.api('me', { fields: ['id', 'name', 'email',], access_token: tok }, function (data) {
			if (data.error) {
				console.info("\n\nFacebook error, in catch grabFBtokenData");
				reject(data.error);
			} else {
				console.log ("\n\nInside .then of grabFBtokenData: ", data);
				fulfill(data)
			}
		});
	});
};