
var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');
var UserController = require(__dirname + '/../../../controllers/user');

exports.routes = {
	listVideos: {
		get: [
			UserController.LoadUser,
			function(req,res,next) {
				if (req.data.length>0) {
					var user = req.data[0];
					req.data = {};
					req.data.query = { "owner": { $in:[user._id]} };
					next();
				}
				else {
					res.status(404).json({
						status: false,
						message: "User not found"
					});
				}
			},
			VideoController.LoadVideos,
			VideoController.LoadThumbnails,
			CommonController.JsonResponse]
	}
};