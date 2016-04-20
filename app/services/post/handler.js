var hat = require('hat');
var Controller = require('./controller');
const {handleAllDb, handleFindNearMe, handleLatestDb, handleCreatedPost, handleLikeTogglePost, } = require('./views');


const utils = require('./util');
const arrayify = utils.arrayifyTypeIds;


// node_modules
var url = require("url");
var Sequelize = require('sequelize');
var hat = require('hat');
var fileType = require('file-type');



post = {
	// Find all posts
	findAll: function(req, res){
		const limit = 10; // Can change

		// Grab params parsed to API
		const q = req.query; // Params from URL
		const params = req.params;

		// Split up types into an array
		const typeIds = typeof q.types != 'undefined' && q.types  ? q.types.split(',') : [];
		const typesarray = arrayify(typeIds);
		const special = q.special;
		const userId = q.userId ? q.userId : null;

		// Grab all possible data && assign defaults
		const data = {
			city: params.city ? params.city : 'melbourne',
			limit: 10,
			offset: q.offset ? parseInt(q.offset) : 0,
			types: typesarray,  // Split into arrray  and slice last index (a comma) 
			typeIds: q.types,
			special: special ? special : null,
			typeIdArray: typeIds,
			latestId: q.latestId ? q.latestId : 0,
			longitude: q.longitude ? q.longitude : null,
			latitude: q.latitude ? q.latitude : null,
			radius: q.radius ? q.radius : null,
			userId: userId,
			nextUrl: q.types  ? "&types="+q.types : "&types=",
		};
		data.nextOffset = (parseInt(data.offset) + limit);
		const {latestId, longitude, latitude,} = data;


		// Determine the controller we need to use
		if (longitude  && latitude) {
			Controller.findByCoords(data)
				.then( (posts) => {
					// console.log(posts, "THE FUCKING ERRO");
					handleFindNearMe(posts, data, res) 
				})
				.catch( (err) => {
					console.log(err);
					res.json("error", "something has gone wrong");
				});
			return;
		} else if (!latestId) {
			// For both nextUrl && initial call ->
			Controller.findAllDb(data)
				.then( (posts) => handleAllDb(posts, data, res)) // ~> ./views/
				.catch((err) => {
					res.json(JSON.stringify({error: "Something went wrong"}));
					console.log(err);
				});

		} else if (latestId) {
			Controller.findLatest(data)
				.then( (posts) => findLatest(posts, data, res))
				.catch((err) => {
					res.json(JSON.stringify({error: "Something went wrong"}));
					console.log(err);
				});

		} /*else {
			res.status(404).json(JSON.stringify({"error": "something went wrong ", "no_controller": "no controller found "}))
		}*/
	},
	createPost: function (req, res) {
		const {body,} = req;
		const fileName = body.photo ? hat() + ".jpeg" : '';

		const data = {
			userId: body.userId,
			city: body.city, // Can be retrieved from params...But grabbing from body
			location_address: body.location,
			description: body.description,
			typeId: body.postType,
			longitude: body.longitude,
			latitude: body.latitude,
			photo: fileName,
			suburb: body.suburb,
			photoData: body.photo,
		};

		Controller.createPost(data)
		.then( (post) => handleCreatedPost(post, data, res))
		.catch((err) => {
			console.log(err);
			res.json(JSON.stringify(err));
		});
	},
	togglePostLike: function(req, res) {
		const {body,} = req; // Using test userId 1
		// console.log("LOCALS: ", res.locals.userId)
		const data = {
			userId: body.userId,
			postId: body.postId,
		}

		Controller.togglePostLike(data)
		.spread( (likedItem, created) => handleLikeTogglePost(likedItem, created, res)); 
	}

}



module.exports = post;
