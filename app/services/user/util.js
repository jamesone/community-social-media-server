const LOCAL_URL = require('../../../config').url;

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
	const {nextOffset, city, typeIds, latestId,} = data;

	return`${LOCAL_URL}post/${city}/?${[
		`offset=${nextOffset}`,
		`latestId=${latestId}`,
    	`types=${encodeURI(typeIds)}`,
    ].join('&')}`;
}

exports.formatPostNearmeNextUrl = function (data) {
	const {nextOffset, city, longitude, latitude, radius} = data;
	

	return`${LOCAL_URL}post/${city}/?${[
		`offset=${nextOffset}`,
		`longitude=${longitude}`,
		`latitude=${latitude}`,
    	`radius=${radius}`,
    ].join('&')}`;

}