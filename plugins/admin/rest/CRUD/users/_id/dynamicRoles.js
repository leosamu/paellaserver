var UserModel = require(__dirname + '/../../../../../../models/user');
var ChannelModel = require(__dirname + '/../../../../../../models/channel');
var VideoModel = require(__dirname + '/../../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../../controllers/auth');
var RoleServices = require(__dirname + '/../../../../../../services/role-services.js');
var Q = require('q');


exports.routes = {
	dynamicRoles: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {					
				UserModel.findOne({"_id": req.params.id }, function(err, user){
					if (err) { return res.sendStatus(500); }
					if (!user) { return res.sendStatus(404); }
							
					RoleServices.getRolesForUser(user)
					.then(function(roles) {
						res.send(roles);
					})
					.catch(function(err) {
						res.sendStatus(500);
					})					
				});				
			}
		]
	}
	
}
