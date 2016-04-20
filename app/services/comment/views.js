const {createCommentNextUrl,} = require('./util');

exports.handleFoundComments = function (comments, data, res ) {
	const x = comments.length;
	if(x == 0  || !x) {
		res.json(JSON.stringify({error: "no comments found", no_comments: "no comments were found for this post"}));
		return;
	}
	const latestId = comments[x-1].commentId;
	data.latestId = latestId;
	const nextUrl = createCommentNextUrl(data);

	console.log("\n\n"+x+" comments were found");

	// console.log("Found comments for photoId ("+req.params.photoId+"): ", comments);
	res.json(JSON.stringify({comments, nextCommentUrl: nextUrl}));
}
