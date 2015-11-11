var mongoose = require('mongoose');
var Iconv = require('iconv').Iconv;
var Buffer = require('buffer').Buffer;

var UPVController = require(__dirname + '/../../controllers/upv');
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
			UPVController.UserByEmail,
			function(req,res,next) {
				function processResult(err,data) {
					var userData = [];
					if (err) {
						res.status(500).send({ status:false, message:err.message });
					}
					else {
						data.forEach(function(user) {
							userData.push({
								id: user._id,
								name: user.contactData.name,
								lastName: user.contactData.lastName,
								email: user.contactData.email
							});
						});
						req.data = userData;
						next();
					}
				}

				req.upvData = req.data;
				var User = require(__dirname + '/../../models/user');
				if (req.upvData) {
					User.find({ "auth.UPV.dni":req.upvData.dni})
						.exec(processResult);
				}
				else {
					User.find({ "contactData.email":req.query.email })
						.exec(processResult);
				}
			},
			function(req,res,next) {
				if (req.upvData && req.data.length==0) {
					// Create new user
					var User = require(__dirname + '/../../models/user');
					var login = /^(.*)@/i.exec(req.upvData.email)[1];
					var userData = {
						auth:{
							UPV: {
								login:login,
								dni:req.upvData.dni,
								nip:req.upvData.nip
							}
						},
						contactData: {
							email:req.query.email,
							lastName:req.upvData.apellidos,
							name:req.upvData.nombre
						}
					};
					var newUser = new User(userData);
					newUser.save(function(err,data) {
						console.log(data);
						req.data = [{
							id: data._id,
							name: data.contactData.name,
							lastName: data.contactData.lastName,
							email: data.contactData.email
						}];
						next();
					});
				}
				else {
					next();
				}
			},
			CommonController.JsonResponse ]
	}
};