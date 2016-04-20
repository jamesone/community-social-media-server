exports.determineError = function (error) {
	switch (error) {
		case "OAuthException":
			return {
				error: "Facebook token is invalid",
				fb_token_error: "invalid error",
				fb_error: "invalid error",
				type: error
			}
		break;
		default: 
			return {
				error: "Something went wrong with creating or loggin in user",
				fb_error: "fb error",
			}
	}
}