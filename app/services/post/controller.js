var configModels    = require('../../../config').models;
var Models = require('../../models');
var Post = Models.post;
var PostType = Models.postType;
var Comment = Models.comment;
var Locations = Models.locations;
var User = Models.user;
var PostLikes = Models.postLikes;
var sequelize = Models.sequelize;
const {buildFindAllPostWhere,} = require('./builder');

exports.findAllDb = function(data){
	const where = buildFindAllPostWhere(data);

	return Post.findAll(where);
}

// Find by coords:
exports.findByCoords = function (data) {
	const {longitude, latitude, radius, nextOffset, offset, } = data;

	// This doesnt work adding a () before AS distance
	return Post.findAll({
		longitude: longitude,
		latitude: latitude,
		include: [
			{ model: User  },
	        // { model: PostLikes },
	        // { model: Comment },
	        { model: Locations }, // #TODO: weird error causing WHERE 0 = type IDHERE IF COMMENTED OUT IT FIXES
	    ],
		attributes: [
			'postId', 'description', 'longitude', 'latitude','photo', 'userId', 'city', 'typeId', 'createdAt', 'location_address',
  			[sequelize.literal(' (6371 * acos ( '
                + 'cos( radians('+latitude+') ) '
                + '* cos( radians( post.latitude ) ) '
                + '* cos( radians( post.longitude ) - radians('+longitude+') )' 
                + '+ sin( radians('+latitude+') )' 
                + '* sin( radians( post.latitude )))) ' ), 'distance'],

  			// Count no comments and likes ~~>
  			[sequelize.literal('(select COUNT(postLikes.postId) from postLikes where postLikes.postId = post.postId)'), 'no_likes'],
  			[sequelize.literal('(select COUNT(comment.postId) from comment where comment.postId = post.postId)'), 'no_comments'],
  			[sequelize.literal('(select COUNT(postLikes.userId) from postLikes where postLikes.postId = post.postId)'), 'user_has_liked'],
  		],
  		// groupBy: 'post.updatedAt',
		having: {
			'distance': {
				$lt: 10
			},
		},
		order: [
			[sequelize.literal('distance ASC')],
			['createdAt', 'DESC'],
			// [sequelize.literal('COUNT (postLikes.postId) ASC')],
		],
		limit: 10,
		offset: offset,

	});
}


exports.findLatest =  function(data){
	console.log("\nFinding the latest posts (Refresh)");
	const {city, typeIds, latestId,} = data;
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
        },
        order: [
        	['createdAt', 'DESC'],
        	['postId', 'DESC'],
        ],
	});
}

exports.createPost = function (data) {
	const {userId, city, location_address, typeId, longitude, latitude, photo, suburb, description,} = data;

	return Post.create({
		userId: userId,
		description: description,
		city: city,
		location_address: location_address,
		typeId: typeId,
		longitude: longitude,
		photo: photo,
		latitude: latitude,
		suburb: suburb
	});
}

exports.togglePostLike = function(data) {
	const {userId, postId,} = data;

	return PostLikes.findOrCreate({
		where: {
			userId: userId,
			postId: postId,
		},
		defaults: {userId: userId, postId: postId}
	});
}

