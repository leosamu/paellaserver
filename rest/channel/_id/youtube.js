var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	setYoutubeId: {
		param:'youtubeId',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			AuthController.CheckRole(['YOUTUBE','ADMIN']),
			ChannelController.LoadChannel,
			function(req,res,next) {
				if (req.data) {
					var channel = req.data;
					var pluginData = JSON.parse(JSON.stringify(channel.pluginData || {}));
					pluginData.youtube = {
						id: req.params.youtubeId
					};
					var Channel = require(__dirname + '/../../../models/channel');
					Channel.update({ "_id":channel._id }, { $set:{ pluginData:pluginData } }, function(err,doc) {
						if (err) {
							req.state(500).json({ status: false, message:err.toString() });
						}
						else {
							next();
						}
					});
				}
				else {
					res.state(401).json({ status:false, message: "No such channel with ID " + req.id});
				}
			},
			CommonController.JsonResponse
		]
	}
};

