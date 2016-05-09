var Models = require('../../models');
var Post = Models.post;
var PostType = Models.postType;
var Comment = Models.comment;
var Locations = Models.locations;
var User = Models.user;
var PostLikes = Models.postLikes;
var sequelize = Models.sequelize;
var {postUserCols,} = require('./controller')
// specials = chronological, likes
/**
* Add in all sequelize queries here! Export an object for each function
**/
exports.buildFindAllPostWhere = function (data) {
	const {city, limit, offset, types, typeIdArray, special, userId,} = data;
	var where = {};

	where['include'] = [
		{ model: User, attributes: postUserCols  },
        // { model: PostLikes },
        // { model: Comment },
        { model: Locations }, 
	];

	where['where'] = {};
	if (userId) {
		where['where']['userId'] = data.userId
	} else {
		where['where']['city'] = city;
	}
	

	// If typeIds > 0, add in where or clause
	if (typeIdArray.length > 0) {
		where['where']['$or']  = typeIdArray.map(function(id) {
	        return {
	            typeId: id
	        };
	    });
	}

	where['attributes'] = [
		'postId', 'description', 'longitude', 'latitude','photo', 'userId', 'city', 'typeId', 'createdAt', 'location_address',

		// Count number of likes
		[sequelize.literal('(select COUNT(postLikes.postId) from postLikes where postLikes.postId = post.postId)'), 'no_likes'],

		// Count number of comments
  		[sequelize.literal('(select COUNT(comment.postId) from comment where comment.postId = post.postId)'), 'no_comments'],

  		// Check of user has liked:
  		[sequelize.literal('(select COUNT(postLikes.userId) from postLikes where postLikes.postId = post.postId)'), 'user_has_liked'],
	];
	
	switch (special) {
		case 'chronological':
			where['order'] = [
    			['createdAt', 'DESC'],
			];
		break;
		case 'likes':
			where['order'] = [
    			[sequelize.literal('no_likes DESC')]
			];
		break;
		default:
			where['order'] = [
    			['createdAt', 'DESC'],
			];
		break;
	}

	where['limit'] = limit;
	where['offset'] = offset;

	return where;
}


// Example of QB
// var x = {
// 		byCity: {
// 			do: true,
// 			city: city,
// 		},
// 		includes: {
// 			do: true,
// 			include: {
// 				{ model: User  },
// 				{ model: Comment },
// 				{ model: Locations }, // #TODO: weird error causing WHERE 0 = type IDHERE IF COMMENTED OUT IT FIXES
// 			}
// 		},
// 		types: {
// 			do: true,
// 			typeIds: typeIdArray,
// 		},
		
// 	}