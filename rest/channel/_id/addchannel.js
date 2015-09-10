var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	addChannel: {
		param: 'otherId',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			ChannelController.LoadChannel,
			function(req,res,next) {
				if (req.data.length==0) {
					res.status(404).json({ status:false, message:"No such channel with id " + req.params.id });
				}
				else {
					next();
				}
			},
			AuthController.CheckWrite,
			function(req,res,next) {
				if (req.params.id==req.params.otherId) {
					res.status(400).json({ status:false, message:"Trying to add a channel to itself" });
				}
				else {
					req.channelData = req.data;
					req.params.id = req.params.otherId;
					next();
				}
			},
			ChannelController.LoadChannel,
			function(req,res,next) {
				if (req.data.length==0) {
					res.status(404).json({ status:false, message:"No such child channel with id " + req.params.videoId });
				}
				else {
					var Channel = require(__dirname + '/../../../models/channel');
					var channelData = req.channelData;
					if (channelData.children.indexOf(req.params.otherId)==-1) {
						channelData.children.push(req.params.otherId);
						Channel.update({"_id":req.channelData._id}, channelData, function(err,data) {
							if (err) {
								res.status(500).json({ status:false, message:"Unexpected error in query: " + err.message() });
							}
							else {
								req.data = channelData;
								next();
							}
						});
					}
					else {
						next();
					}
				}
			},
			CommonController.JsonResponse
		]
	}
};

