var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');
var UserController = require(__dirname + '/../../controllers/user');

exports.routes = {
	getUserVideos: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res,next) {
				req.params.search = req.query.email;
				next();
			},
			UserController.Search('contactData.email'),
			function(req,res,next) {
				var userData = [];
				req.data.forEach(function(user) {
					userData.push({
						id: user._id,
						name: user.contactData.name,
						lastName: user.contactData.lastName,
						email: user.contactData.email
					})
				});
				req.data = userData;
				next();
			},
			CommonController.JsonResponse ]
	}
};