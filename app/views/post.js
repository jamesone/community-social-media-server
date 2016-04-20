var Post = require('../models').post;
var PostType = require('../models').postType;
var Comment = require('../models').comment;
var Locations = require('../models').locations;
var url = require("url");
var Sequelize = require('sequelize');
var User = require('../models').user;
var sequelize = require('../models').sequelize;
var fileWriter = require('../modules/fileWriter/fileWriter');

var hat = require('hat');
var fileType = require('file-type');
var configModels    = require('../../config').models;
const local_url = require('../../config').url;


post = {
	// Find all posts
	findAll: function(req, res){
		const limit = 10; // Can change

		//  Params
		const queryParams = req.query; // Params from URL
		const params = req.params;

		// City
		const city = params.city ? params.city : 'melbourne';

		// Offset
		const offset = queryParams.offset ? queryParams.offset : 0;  // Grab the offset
		const nextOffset = parseInt(offset) + limit; // Set the next offset for the nexturl

		// Filter
		const filter = queryParams.filter;
		const types = queryParams.types;

		// Next URL
		if  (typeof(types) == undefined) {
			types == '';
		}
		var nextUrl = "&types="+types;

		// Split up query types | If none were parsed then means select all
		const queryTypes = typeof types != 'undefined' && types  ? types.split(',') : [];
		var typeIds = queryTypes ? queryTypes.map(function(id, index){
			if (typeof(id) == undefined) {
				return;
			}
			return {typeId: id}
		}) : [];

		// For pagination
		var latestId = queryParams.latestId ? queryParams.latestId : 0;

		// If there are coords, grab them.
		const longitude = queryParams.longitude;
		const latitude = queryParams.latitude;
		const radius = queryParams.radius;
		console.log(longitude, latitude);
		if (longitude && latitude) {
			findByCoords(longitude, latitude, radius, offset, city, res);
			return;
		}

		// // findAllDb;
		// // post.findAllDb;
		// if(queryParams.date){
		// 	post.findLatest(city,typeIds, queryParams.date, req, res);
		// 	return;
		// }
		// console.log(queryParams.latestId, "SADASDA");
		// If refreshing feed.
		if(queryParams.latestId) {
			// #TODO: When no ids are parsed (means they are not filtering) typeIds = [] and fucks up or query


			post.findLatest(city, typeIds, queryParams.latestId, offset, limit, nextOffset, nextUrl, req, res)
			return;
		}

		if (typeIds.length == 0) {
				console.log("empty")
				post.tempFixForNoIdsBug(city, typeIds, queryParams.latestId, offset, limit, nextOffset, nextUrl, req, res)
				return;
		}

		// parse arguments & return a json object
		post.findAllDb(city, typeIds, latestId, offset, limit, nextOffset, nextUrl, req, res);
	},
	// GEO search find all posts X distance from parsed coords
	findNearMe: function(req, res){
		var limit = 30;
		var params = req.params;
		var offset = params.offset;
		var city = params.city;
		var radius = params.radius;
		var longitude = params.longitude;
		var latitude = params.latitude;


		Post.findAll({
			include: [
	            { model: User  },
	            // { model: Comment }
	        ],
	        where: {
	        	city: city
	        },
	        offset: offset,
	        limit: limit
		}).then(function(posts){
			res.json(JSON.stringify({ posts, nextUrl: local_url+"post/"+city+"/?offset="+nextOffset}));
		}).catch(function(err){
			console.log(err);
			res.status(400).json("error", "something has gone wrong");
		});
	},
	findById: function(req){
		Post.findById(req.photoId).then(function(photo){
			console.log("Found by ID:  ", photo);
		});
	},
	findAllDb: function(city,typeIds,latestId, offset, limit, nextOffset, queryParams, req, res){
		console.log(typeIds);
		console.log("CITY: , ",city);
		console.log("OFFSET", offset);
		console.log("LIMIT", limit);
		// if (!typeIds) {
		// 	typeIds = [{typeId: '*'}];
		// }


		Post.findAll({
			include: [
	            { model: User  },
	            { model: Comment },
	            { model: Locations }, // #TODO: weird error causing WHERE 0 = type IDHERE IF COMMENTED OUT IT FIXES
	        ],
	        where:
	        {
	        	// Sequelize.or(
	        		// typeId: typeIds
	        	// )
	        	$or: typeIds, //causing fucking problems :( where 1 = 0???
	        	city: city,


	        },
	        limit: limit,
	        offset: parseInt(offset),
	        order: [
	        	['createdAt', 'DESC'],
	        	['typeId', 'ASC'],
	        ],

	        // raw: true,

		}).then(function(posts){
			if(posts.length == 0) {
				res.json(JSON.stringify({error: 'no posts found', no_post: 'no posts', no_more_paging: 'no more results found'}));
				return;
			}
			const nextId = posts[0].postId;
			console.log("\n\nPosts found: ", posts.length);
			console.log("\n\nNextUrl: ",  local_url+"post/"+city+"/?offset="+nextOffset+"&latestId="+nextId+queryParams);
			// console.log(queryParams);
			// console.log(nextId);
				      //   	typeId: {
	        	// 	gt: latestId
	        	// }
	        	//+"?latestId="+latestId
			res.json(JSON.stringify({posts, nextUrl: local_url+"post/"+city+"/?offset="+nextOffset+"&latestId="+nextId+queryParams}));
		}).catch(function(err){
			res.json(JSON.stringify({error: "Something went wrong"}));
			console.log(err);
		});
	},
	// THIS WILL FIND THE LATEST IDS
	findLatest: function(city,typeIds,latestId, offset, limit, nextOffset, queryParams, req, res){
		console.log(typeIds);

		Post.findAll({
			include: [
	            { model: User  },
	            { model: Locations }
	        ],
	        where:
	        {
	        	city: city,
	        	$or: typeIds,
	        	postId: {
	        		gt: latestId
	        	},
				// $and: ['typeId > ', latestId], // latestId
	        },
	        order: [
	        	['createdAt', 'DESC'],
	        	['postId', 'DESC'],
	        ],
	        // limit: limit,
	        // offset: offset,
		}).then(function(posts){
			if(posts.length == 0) {
				res.json(JSON.stringify({error: 'no posts found', no_posts: 'no posts', update_to_date: 'already up to date'}));
				return;
			}
			console.log("\n\nPosts found: ", posts.length);
			console.log("\n\nRefreshed, nextRefresh is:",  local_url+"post/"+city+"/?offset="+offset+"&latestId=125"+queryParams);
			const nextId = posts[0].postId;

			// PASS BACK THE latestId & OFFSET (so we can keep track of there current status) if user has refreshed, update the refreshURL
			res.json(JSON.stringify({posts, nextUrl: local_url+"post/"+city+"/?offset="+offset+"&latestId="+nextId+queryParams}));
		}).catch(function(err){
			res.json(JSON.stringify({error: "Something went wrong"}));
			console.log(err);
		});
	},
	createPost: function(req, res){
		console.log("\n\nCreating Post\n");
		var fileName = "";
		if(!req.body.photo == "") {
			fileName = hat() + ".jpeg";
		}

		Post.create({
			userId: req.body.userId,
			description: req.body.description,
			city: req.body.city,
			location_address: req.body.location,
			typeId: req.body.postType,
			longitude: req.body.longitude,
			fileName: fileName,
			latitude: req.body.latitude,
			suburb: req.body.suburb
		}).then(function(post){
			if(fileName){
				fileWriter(fileName, req.body.photo, function(err){
					if(err){
						console.log(err);
						res.json(400).json(JSON.stringify({error: "Something has gone wrong, try again."}))
						return;
					}
				});
			}
			res.status(201).json(JSON.stringify(post));
		}).catch(function(err){
			console.log(err);
			res.json(400).json(JSON.stringify(err));
		});
	},
	tempFixForNoIdsBug: function(city,typeIds,latestId, offset, limit, nextOffset, queryParams, req, res){
		console.log(typeIds);
		console.log("CITY: , ",city);
		console.log("OFFSET", offset);
		console.log("LIMIT", limit);



		Post.findAll({
			include: [
	            { model: User  },
	            { model: Comment },
	            { model: Locations }, // #TODO: weird error causing WHERE 0 = type IDHERE IF COMMENTED OUT IT FIXES
	        ],
	        where:
	        {
	        	city: city,
	        },
	        limit: limit,
	        offset: parseInt(offset),
	        order: [
	        	['createdAt', 'DESC'],
	        	['typeId', 'ASC'],
	        ],

	        // raw: true,

		}).then(function(posts){
			if(posts.length == 0) {
				res.json(JSON.stringify({error: 'no posts found', no_post: 'no posts', no_more_paging: 'no more results found'}));
				return;
			}
			const nextId = posts[0].postId;
			console.log("\n\nPosts found: ", posts.length);
			console.log("\n\nNextUrl: ",  local_url+"post/"+city+"/?offset="+nextOffset+"&latestId="+nextId+queryParams);
			// console.log(queryParams);
			// console.log(nextId);
				      //   	typeId: {
	        	// 	gt: latestId
	        	// }
	        	//+"?latestId="+latestId
			res.json(JSON.stringify({posts, nextUrl: local_url+"post/"+city+"/?offset="+nextOffset+"&latestId="+nextId+queryParams}));
		}).catch(function(err){
			res.json(JSON.stringify({error: "Something went wrong"}));
			console.log(err);
		});
	},
	// findLatest: function(city,typeIds, date, req, res){
	// 	Post.findAll({
	// 		include: [
	//             { model: User  },
	//             { model: Comment },
	//         ],
	//         where:
	//         {
	//         	createdAt: {
	//         		gt: date
	//         	},
	//         	city: city,
	//         	$or: typeIds,

	//         },
	//         order: [
	//         	['createdAt', 'DESC'],
	//         ],
	//         limit: limit,
	//         offset: offset,
	// 	}).then(function(posts){
	// 		res.json(JSON.stringify(posts));
	// 	}).catch(function(err){
	// 		console.log(err);
	// 	});
	// },

}

function findByCoords(longi, lati, radius, offset,city, res){
	const distance = radius ? radius : 10;
	"SELECT " +
				"user.*, post.*, ( " +
					" 6371 * acos ( " +
					" cos ( radians("+lati+") ) " +
					" * cos( radians( post.latitude ) ) " +
					" * cos( radians( post.longitude ) - radians("+longi+") ) " +
					" + sin ( radians("+lati+") ) " +
					" * sin( radians( post.latitude ) ) " +
				")" +
		") AS distance " +
		"FROM " + configModels.post +  " as post " +
		"JOIN user as user ON post.userId = user.userId " +
		"HAVING distance < "+ distance + " " +
		"ORDER BY distance, post.createdAt DESC " +
		"LIMIT 0 , 40"

		/**
			SELECT
			user.*, post.*, (
			6371 * acos (
			cos ( radians(-37.87996) )
			* cos( radians( post.latitude ) )
			 * cos( radians( post.longitude ) - radians(145.05284) )
			 + sin ( radians(-37.87996) )
			* sin( radians( post.latitude ) )
			)
			) AS distance
			FROM post as post
			JOIN user as user ON post.userId = user.userId
			HAVING distance < 15 ORDER BY distance, post.createdAt DESC LIMIT 0 , 40
		**/
	// const nextOffset = (offset + 10);
	const nxtOffset = parseInt(offset) + 10; // Set the next offset for the nexturl
	// No need for nextURL - Only show 20 nearby
	Post.sequelize.query(
			"SELECT " +
				    "user.*, post.*, ( " +
				      " 6371 * acos ( " +
				      " cos ( radians("+lati+") ) " +
				      " * cos( radians( post.latitude ) ) " +
				      " * cos( radians( post.longitude ) - radians("+longi+") ) " +
				      " + sin ( radians("+lati+") ) " +
				      " * sin( radians( post.latitude ) ) " +
				    ")" +
				") AS distance " +
				"FROM " + configModels.post +  " as post " +
				"JOIN user as user ON post.userId = user.userId " +
				"HAVING distance < "+ distance + " " +
				"ORDER BY distance, post.createdAt DESC " +
				"LIMIT "+offset+" , "+nxtOffset,
		{
			join: true,
			type: sequelize.QueryTypes.SELECT
		})
		.then(function(posts) {
			console.log("\n\nPosts found: ", posts.length);
			if(posts.length == 0){
				res.status(201).json(JSON.stringify({"success":"No buses found within "+distance+"KM of you", no_more_paging: "no_more_paging"}));
				return;
			}
				// console.log(posts.length);
				console.log(posts.length, " found posts");
				console.log("GEO NEXTURL = ", local_url+"post/"+city+"/?offset="+nxtOffset+"&longitude="+longi+"&latitude="+lati);
				res.status(201).json(JSON.stringify({
					posts,
					nextUrl: local_url+"post/"+city+"/?offset="+nxtOffset+"&longitude="+longi+"&latitude="+lati+"&radius="+distance,
					is_geo: 'is geo'
				}));
		    // res.status(201).json(JSON.stringify({posts, is_geo: 'is geo'}));
		}).catch(function(err) {
			console.log(err);
			res.status(400).json("error", "something has gone wrong");
		});

}

// function findAll(city,typeIds, offset, limit, nextOffset, queryParams, req, res){

// 	Post.findAll({
// 		include: [
//             { model: User  },
//             { model: Comment },
//             { model: PostType }
//         ],
//         where: {
//         	city: city,
//         	// $and: [
//         	// 	typeIds
//         	// ]
//         },
//         order: [
//         	['createdAt', 'DESC']
//         ],
//         limit: limit,
//         offset: offset,
// 	}).then(function(posts){
// 		console.log("\n\nPosts found: ", posts.length);
// 		res.json(JSON.stringify({posts, nextUrl: "http://localhost:3000/api/v1/post/"+city+"/?offset="+nextOffset+queryParams}));
// 	}).catch(function(err){
// 		console.log(err);
// 	});
// }

module.exports = post;
