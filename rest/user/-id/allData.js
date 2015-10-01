
var mongoose = require('mongoose');

var UserController = require(__dirname + '/../../../controllers/user');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getUserData: { get:[
		AuthController.EnsureAuthenticatedOrDigest,
		AuthController.CheckRole(['ADMIN','POLIMEDIA']),
		UserController.LoadUser,
		function(req,res,next) {
			if (req.data && req.data.length) {
				var userData = JSON.parse(JSON.stringify(req.data[0]));
				if (userData.auth && userData.auth.polimedia) {
					delete userData.auth.polimedia.pass;
				}
				req.data = userData;
			}
			next();
		},
		CommonController.JsonResponse ]
	}
};
