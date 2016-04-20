var Locations = require('../models').locations;

locations = {
	findAll: function(req, res){
		Locations.findAll().then(function(cats){
			console.log(JSON.stringify(cats));
			// console.log(res);
			res.json(JSON.stringify(cats));
		});
	}
}

module.exports = locations;