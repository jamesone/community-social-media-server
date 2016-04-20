// Pass in your sequelize JSON object
module.exports = function(json){ 
	var returnedJson = []; // This will be the object we return
	json = JSON.parse(json);

	
	// Extract the JSON we need 
	if(json[0].hasOwnProperty('dataValues')){
		console.log("HI: " + json[0].dataValues);
		returnedJson = json[0].dataValues; // This must be an INSERT...so dig deeper into the JSON object
	} else {
		console.log(json[0]);
		returnedJson = json[0]; // This is a find...so the JSON exists here
	}

	return returnedJson; // Finally return the json object so it can be used
}