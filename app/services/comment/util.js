const {url,} = require('../../../config');

exports.createCommentNextUrl = function (data) {
	const {offset, limit, postId, latestId, } = data;
	const newOffset = (parseInt(offset)+parseInt(limit)) ;
	
	return`${url}comments/?${[
		`offset=${newOffset}`,
		`limit=${limit}`,
		`postId=${postId}`,
		`latestCommentId=${latestId}`,
    ].join('&')}`;
}