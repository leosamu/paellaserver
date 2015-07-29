var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	publish: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			VideoController.LoadVideo,
			AuthController.LoadRoles,
			AuthController.CheckWrite,
			function(req,res,next) {
				if (req.data.length) {
					var Video = require(__dirname + '/../../../models/video');
					var video = req.data[0];
					video.published ? video.published.status = true:video.published = { status:true };
					Video.update({"_id":video._id},{ 'published.status':true },{}, function(err,data) {
						next();
					});
				}
			},
			CommonController.JsonResponse
		]
	}
};

