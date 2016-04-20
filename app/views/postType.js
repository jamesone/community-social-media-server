var PostType = require('../models').postType;

postType = {
	findAll: function(req, res){
		PostType.findAll().then(function(cats){
			console.log(JSON.stringify(cats));
			// console.log(res);
			res.json(JSON.stringify(cats));
		});
	}
}

module.exports = postType;