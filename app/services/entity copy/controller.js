var Entity = require('../../models').entityLikes;
var EntityIds = require('../../../config').entityIds;

// can be turned into generic like function...e.g can use for comment likes too.
exports.togglePostLike = function(data) {
	const {userId, entityId,} = data;

	return Entity.findOrCreate({
		where: {
			userId: userId,
			// $and: {
				entityId: EntityIds.post,
			// }
		},
		defaults: {userId: userId, entityId: EntityIds.post}
	});
}

// function deletePostLike = function(userId, entityId) {
// 	console.log("\nPost deleted: ", entityId);

// 	Entity.
// }