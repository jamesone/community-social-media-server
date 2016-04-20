var validateAuth = require('../routes/auth').validateToken;
 
module.exports = function(req, res, next) {
	console.log("\nValidating request") ;
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
 
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
	
	if(token || key){
		validateAuth(token).then(function(results){
	        if(!results){
	          	res.status(401);
			    res.json({
			      "status": 401,
			      "message": "Invalid Token or Key"
			    });
			    return;
	        }		

	      }).catch(function(err){
	          res.status(500);
		      res.json({
		        "status": 500,
		        "message": "Oops something went wrong",
		        "error": err
		      });
		      return;
	   	});
	} else {
		// If there is no token parsed
		res.status(401);
		    res.json({
		      "status": 401,
		      "message": "Invalid Token or Key"
		});
		return;
	}


	next();
};