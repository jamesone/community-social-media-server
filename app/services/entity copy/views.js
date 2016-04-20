const local_url = require('../../../config').url;

exports.handleLikeTogglePost = function(entityLikedItem, created, res) {
	if (!created) {
		const {userId, entityId,} = user;
		
		// Delete the row that we found in ./controller.js togglePostLike
		entityLikedItem.destroy(); 

		res.json(JSON.stringify({success: "unliked post", post_unliked: "true", userId: userId}));
		console.log("\nPost has been unliked");
		return;
	} 

	console.info("\nPost has been liked");
	res.json(JSON.stringify({success: "liked post", post_liked: "true", userId: userId}));

}
