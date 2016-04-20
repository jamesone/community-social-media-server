const local_url = require('../../../config').url;
/**
	Can be replaced with external api calls and BFF'iFIED (backend for frontnend microservices :D)
	Handles promises and returns data to user

**/


exports.returnLogin = function(token, user, res){
	// Should never occur but for extra security ->
	if (!token) {
		res.json(JSON.stringify({error: "something went wrong, try again", try_again: "try again"}));
		return;
	}

	res.json(JSON.stringify({token: token, user: user, success: "logged in successfully"}));
}
