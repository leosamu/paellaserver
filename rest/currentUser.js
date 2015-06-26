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
				var userData = {
					"_id":"0",
					"auth": {},
					"roles":[
						{"_id":"ANONYMOUS","description":"Anonymous user"}
					],
					"contactData": {
						"email":"",
						"lastName":"anonymous",
						"name":"Anonymous"
					}
				};

				res.json(userData);
			}
		}]
	}
};
