var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getCurrentUser: { get:[
//		AuthController.EnsureAuthenticatedOrDigest,
		function(req,res) {
			if (req.user) {
				res.json(req.user);
			}
			else {
				var userData = AuthController.getAnonymousUser();

				res.json(userData);
			}
		}]
	}
};
