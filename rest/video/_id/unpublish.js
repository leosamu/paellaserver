var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	unpublish: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				if (req.data.length) {
					var video = req.data[0];
					video.published.status = false;
					video.save();
				}
				next();
			},
			CommonController.JsonResponse
		]
	}
};

