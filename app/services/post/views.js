const local_url = require('../../../config').url;
const {formatPostNextUrl, formatPostNearmeNextUrl,} = require('./util');
var fileWriter = require('../../modules/fileWriter/fileWriter');
/**
	Can be replaced with external api calls and BFF'iFIED (backend for frontnend microservices :D)
	Handles promises and returns data to user

**/

// Has been replaced with SQL query
// function checkIfUserHasLiked (posts, userId) {
// 	posts.map(function(post, i) {
// 		post.postLikes.map(function (like, x){

// 			if (like.userId == userId) {
// 				// like.push({hasLiked: true})
// 				// like.dataValues.hasLiked = true;
// 				post.dataValues.hasLiked = true;
// 			} else {
// 				// like.push({hasLiked: false})
// 				// like.dataValues.hasLiked = false;
// 				post.dataValues.hasLiked = false;
// 			}
// 		});
	
// 	});
	
// 	return posts;
// }

exports.handleAllDb = function(posts, data, res){
	if(posts.length == 0) {
		res.json(JSON.stringify({error: 'no posts found', no_post: 'no posts', no_more_paging: 'no more results found'}));
		return;
	}
	const {city, nextOffset,} = data;

	// console.log(posts)
	// data.latestId = postss[0].postId; // Add latest ID to data set
	data.latestId = posts[0].postId; // Add latest ID to data set
	const nextUrl = formatPostNextUrl(data);

	console.info("\n\nPosts found: ", posts.length);
	console.info("\nNextUrl: ", nextUrl);
	res.json(JSON.stringify({posts, nextUrl: nextUrl}));
}

exports.handleFindNearMe = function (posts, data, res){
	if(posts.length == 0){
		res.status(201).json(JSON.stringify({"success":"No posts found within "+data.radius+"KM of you", no_more_paging: "no_more_paging"}));
		return;
	}

	const nextUrl = formatPostNearmeNextUrl(data);
	console.log("\n\nPosts found near me: ", posts.length);
	console.log("\nGeo nextUrl: ", nextUrl);

	res.status(201).json(JSON.stringify({
		posts,
		nextUrl: nextUrl,
		is_geo: 'is geo'
	}));
}

exports.handleLatestDb = function (posts, data, res) {
		if(posts.length == 0) {
			res.json(JSON.stringify({error: 'no posts found', no_posts: 'no posts', update_to_date: 'already up to date'}));
			return;
		}
		const {city, nextOffset, nextUrl,} = data;

		console.log("\n\nPosts found: ", posts.length);
		console.log("\n\nRefreshed, nextRefresh is:",  local_url+"post/"+city+"/?offset="+nextOffset+"&latestId=125"+queryParams);
		const nextId = posts[0].postId;

		// PASS BACK THE latestId & OFFSET (so we can keep track of there current status) if user has refreshed, update the refreshURL
		res.json(JSON.stringify({posts, nextUrl: local_url+"post/"+city+"/?offset="+nextOffset+"&latestId="+nextId+nextUrl}));
	
}

const writeLocally = true;
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'ap-southeast-2'});
var s3Bucket = new AWS.S3( { params: {Bucket: 'community-api-content'} } );

exports.handleCreatedPost = function (post, data, res) {
		const {photo, photoData,} = data;
		console.log (photoData);
		console.log (photo);

		if (!writeLocally){
			// Upload data to s3
			buf = new Buffer(photoData.uri.replace(/^data:image\/\w+;base64,/, ""),'base64')
			var imageData = {
			    Key: 'public/images/' + photo, 
			    Body: buf,
			    ContentEncoding: 'base64',
			    ContentType: 'image/jpeg',
			    ACL:'public-read'
			};

			s3Bucket.putObject(imageData, function(err, data){
			      if (err) { 
			        console.log(err);
			        console.log('Error uploading data: ', data); 
			      } else {
			        console.log('succesfully uploaded the image!', photo);
			      }
			});
		} else {
			// // If file base64 was parsed then save it to server
			if(photo != ''){
				fileWriter(photo, photoData, function(err){
					if(err){
						console.log(err);
						res.json(JSON.stringify({error: "Something has gone wrong, try again.", "post_error": "image was not saved"}))
						return;
					}
					console.info("\nFile saved to server: ", photo)
				});
			}
		}
		
		res.json(JSON.stringify({post, "success": "post created successfully"}));
}

exports.handleLikeTogglePost = function(likedItem, created, res) {
	if (!created) {
		const {userId, postId,} = user;
		
		// Delete the row that we found in ./controller.js togglePostLike
		likedItem.destroy(); 

		res.json(JSON.stringify({success: "unliked post", post_unliked: "true", userId: userId, postId: postId}));
		console.log("\nPost has been unliked");
		return;
	} 

	console.info("\nPost has been liked");
	res.json(JSON.stringify({success: "liked post", post_liked: "true", userId: userId, postId: postId}));

}
