var Comment = require('../../models').comment;
var User = require('../../models').user;


exports.findLatestComments = function (data) {
	const {postId, latestCommentId, offset, limit,} = data;

	return Comment.findAll({
		include: [
			{model: User },
		],
		where: {
			commentId: {
				gt: latestCommentId,
			},
			$and: {
				postId: postId,
			}
			// postId: {
			// 	gt: latestId,
			// }
		},
			// offset: offset,
	});
}

exports.findAllComments = function(data){
	const {postId, offset, limit,} = data;
	console.log(data)

	return Comment.findAll({
		include: [
			{model: User },
		],
			where: {
				postId: postId,
			},
			offset: offset,
			limit: limit,
	});
}