var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getChannelData: {
		get: [
			ChannelController.ParentsOfVideo,
			ChannelController.LoadUrlFromRepository,
			CommonController.JsonResponse
		]
	}
};

