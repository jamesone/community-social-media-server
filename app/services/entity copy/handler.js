const local_url = require('../../../config').url;
const Controller = require('./controller');
const {handleLikeTogglePost,} = require('./views');

/*
	Destroy entityIf where userId = x
*/
entity = {
	togglePostLike: function(req, res) {
		const {body, } = req;
		
		const data = {
			userId: body.userId,
			entityId: body.entityId,
		}

		Controller.togglePostLike(data)
		.spread( (entityLikedItem, created) => handleLikeTogglePost(entityLikedItem, created, res)); 
	}

}

module.exports = entity;