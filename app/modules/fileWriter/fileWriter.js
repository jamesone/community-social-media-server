// This module is responsible for converting an image buffer to a png file and saving it to the server
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var decoder = new StringDecoder('utf8'); // Create decoder for our buffer


// This converts the passed buffer to an image file (png)
module.exports = function(imageFileName, base64Data, callback){
	var data = base64Data.uri;
	var imageBuffer = decodeBase64Image(data);
	fs.writeFile(__dirname+'/../../../media/post_photos/'+imageFileName, imageBuffer.data, function(err) {
		callback(err);
	});
}

// decode string
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    console.log('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


