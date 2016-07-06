var mongoose = require('mongoose');

var VideoController = require(__dirname + '/../../controllers/video');
var CommonController = require(__dirname + '/../../controllers/common');
var AuthController = require(__dirname + '/../../controllers/auth');
var UserController = require(__dirname + '/../../controllers/user');


exports.routes = {
	searchName: {
		get: [
			function(req,res,next) {
				var User = require(__dirname + '/../../models/user');
				var options = [];
				try {
					req.query.search.split(' ').forEach(function(token) {
						if (token) {
							options.push({ "contactData.name":{"$regex":token, $options:'i'} });
							options.push({ "contactData.lastName":{"$regex":token, $options:'i'} });
						}
					});
					if (options.length) {
						User.find({ "$or":options })
							.then(function(data) {
								req.data = [];
								data.forEach(function(userData) {
									req.data.push({
										id:userData._id,
										name:userData.contactData.name,
										lastName:userData.contactData.lastName
									});
								});
								next();
							});
					}
					else {
						req.data = [];
						next();
					}
				}
				catch (e) {
					req.data = [];
					next();
				}
			},
			CommonController.JsonResponse ]
	}
};