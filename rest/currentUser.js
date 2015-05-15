var mongoose = require('mongoose');

var AuthController = require(__dirname + '/../controllers/auth');

exports.routes = {
	getCurrentUser: { get:[
		AuthController.EnsureAuthenticatedOrDigest,
		function(req,res) {
			if (req.user) {
				res.json(req.user);
			}
			else {
				res.json({
					status:false,
					message:"No user logged in"
				})
			}
		}]
	}
};
