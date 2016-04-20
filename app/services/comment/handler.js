var Comment = require('../../models').comment;
const local_url = require('../../../config').url;
const Controller = require('./controller');
const {handleFoundComments,} = require('./views');


comment = {
	findAll: function(res){
		Comment.findAll().then(function(comments){
			console.log("Found all comments", comments);
			res.json(comments);
		});
	},
	findByPostId: function(req, res){
		const params = req.params;
		const queryParams = req.query;

		const data = {
			latestCommentId: queryParams.latestCommentId ? parseInt(queryParams.latestCommentId) : null,
			offset: queryParams.offset ? queryParams.offset : 0,
			postId: parseInt(queryParams.postId),
			limit: queryParams.limit ? queryParams.limit : 15,
		};

		if (data.latestCommentId != null){
			Controller.findLatestComments(data)
				.then( (comments) => handleFoundComments (comments, data, res))
				.catch( (err) => {
					console.log ("\nError finding latest comments: ", err);
					res.json(JSON.stringify({error: "no comments found", up_to_date: "got all the latest comments"}));
					return;
				}); 
				//  function (comments) {
				// 	console.log ("\n\nFound latest comments");

				// 	// MOVE THE NEXTURL BUILDER INTO UTILS.JS ------------>
				// 	const x = comments.length;
				// 	console.log(x);
				// 	console.log(comments);
				// 	if(x == 0) {
				// 		res.json(JSON.stringify({error: "no comments found", up_to_date: "got all the latest comments"}));
				// 		return;
				// 	}
				// 	const latestId = comments[0].commentId;
				// 	console.log("\n\n"+x+" comments were found");

				// 	// console.log("Found comments for photoId ("+req.params.photoId+"): ", comments);
				// 	res.json(JSON.stringify({comments, nextCommentUrl: local_url+'comments/'+postId+'/?latestCommentId='+latestId}));
				// })
				// .catch(function (err) {
				// 	console.log ("\n\nError inside findLatestComments: ", err);
				// });
		} else {
			Controller.findAllComments(data)
				.then( (comments) => handleFoundComments(comments, data, res))
				.catch(function(err){
					console.log(err);
				});
		}


		// const latestCommentId = queryParams.latestCommentId ? queryParams.latestCommentId : 0;
		// const offset = queryParams.offset ? queryParams.offset : 0;
		// const postId = params.postId;


		// console.log(params);
		// if(latestCommentId) {
		// 	console.log("janjnajnjnjn");
		// 	comment.findLatestComments(latestCommentId, postId, req, res);
		// 	return;
		// } else {
		// 	comment.findAllComments(postId, req, res);
		// 	return;
		// }
		// Comment.findAll({
		// 	where: {
		// 		'postId': postId,
		// 	},
		// 	// offset: offset,
		// }).then(function(comments){
		// 	const x = comments.length;
		// 	// const latestId = comments[latestId].commentId;
		// 	console.log(comments);

		// 	// console.log("Found comments for photoId ("+req.params.photoId+"): ", comments);
		// 	res.json(JSON.stringify({comments, nextCommentUrl: local_url+'comments/?latestCommentId=1'}));

		// }).catch(function(err){
		// 	console.log(err);
		// });
	},
	insertComment: function(req, res){
		// console.log("\n\nTrying to insert comment to photoId: " + req.params.photoId);
		Comment.create({
			postId: req.body.postId,
			userId: req.body.userId,
			comment: req.body.comment,
		}).then(function(comment){
			res.status(201).json(JSON.stringify(comment));
			// console.log("Created comment: --->", comment);
		}).catch(function(error) {
			console.log("Error inserting comment: ", error);
			throw error;
  		})
	},
	// findAllComments: function(postId, req, res){
	// 	Comment.findAll({
	// 		where: {
	// 			'postId': postId,
	// 		},
	// 		// offset: offset,
	// 	}).then(function(comments){
	// 		const x = comments.length;
	// 		if(x == 0) {
	// 			res.json(JSON.stringify({error: "no comments found", no_comments: "no comments were found for this post"}));
	// 			return;
	// 		}
	// 		const latestId = comments[x-1].commentId;
	// 		// const latestId = comments[latestId].commentId;
	// 		console.log("\n\n"+x+" comments were found");

	// 		// console.log("Found comments for photoId ("+req.params.photoId+"): ", comments);
	// 		res.json(JSON.stringify({comments, nextCommentUrl: local_url+'comments/'+postId+'/?latestCommentId='+latestId}));

	// 	}).catch(function(err){
	// 		console.log(err);
	// 	});
	// },
	// findLatestComments: function(latestId, postId, req, res){
	// 	console.log("inside xxx");
	// 	Comment.findAll({
	// 		where: {
	// 			commentId: {
	// 				gt: latestId,
	// 			},
	// 			$and: {
	// 				postId: postId,
	// 			}
	// 			// postId: {
	// 			// 	gt: latestId,
	// 			// }
	// 		},
	// 		// offset: offset,
	// 	}).then(function(comments){
	// 		const x = comments.length;
	// 		console.log(x);
	// 		console.log(comments);
	// 		if(x == 0) {
	// 			res.json(JSON.stringify({error: "no comments found", up_to_date: "got all the latest comments"}));
	// 			return;
	// 		}
	// 		const latestId = comments[0].commentId;
	// 		console.log("\n\n"+x+" comments were found");

	// 		// console.log("Found comments for photoId ("+req.params.photoId+"): ", comments);
	// 		res.json(JSON.stringify({comments, nextCommentUrl: local_url+'comments/'+postId+'/?latestCommentId='+latestId}));

	// 	}).catch(function(err){
	// 		console.log(err);
	// 	});
	// }

}

module.exports = comment;