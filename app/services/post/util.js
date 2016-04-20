const {url, models,} = require('../../../config');


exports.arrayifyTypeIds = function (typeIds) {
	// const types = typeof typeIds != 'undefined' && typeIds  ? typeIds.split(',') : [];
	if (typeIds.length == 0) return [];

	var x = typeIds.map(function(id, index){
		if (typeof(id) == undefined) {
			return;
		}
		return {typeId: id}
	});

	return x
}	

exports.formatPostNextUrl = function (data) {
	const {nextOffset, city, typeIds, latestId,special, userId,} = data;

	if (userId) {
		return `${url}post/${city}/?${[
			`offset=${nextOffset}`,
			`latestId=${latestId}`,
	    	`userId=${userId}`,
	    	`filter=${special}`,
    	].join('&')}`; 
	}

	return`${url}post/${city}/?${[
		`offset=${nextOffset}`,
		`latestId=${latestId}`,
    	`types=${encodeURI(typeIds)}`,
    	`filter=${special}`,
    ].join('&')}`;
}

exports.formatPostNearmeNextUrl = function (data) {
	const {nextOffset, city, longitude, latitude, radius} = data;

	return`${url}post/${city}/?${[
		`offset=${nextOffset}`,
		`longitude=${longitude}`,
		`latitude=${latitude}`,
    	`radius=${radius}`,
    ].join('&')}`;
}