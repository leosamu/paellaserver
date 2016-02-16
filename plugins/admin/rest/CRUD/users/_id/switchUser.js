var UserModel = require(__dirname + '/../../../../../../models/user');
var ChannelModel = require(__dirname + '/../../../../../../models/channel');
var VideoModel = require(__dirname + '/../../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../../controllers/auth');
var Q = require('q');

exports.routes = {
	switchUser: {
		post: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {					
				UserModel.findOne({"_id": req.params.id }, function(err, user){
					if (err) { return res.sendStatus(500); }
					if (!user) { return res.sendStatus(404); }
					
					req.login(user, function(err) {
						if (err) { return res.sendStatus(500); }
						return res.send(user);
					});
				});				
			}
		]
	}
	
}
