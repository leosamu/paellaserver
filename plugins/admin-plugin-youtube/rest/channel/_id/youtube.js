var Model = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	getModel: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {				
				var roles = req.user.roles.map(function(a) {return a._id;});
				var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});
				var query = {_id: req.params.id};
				if (!isAdmin){
					query = {_id: req.params.id, permissions: {$elemMatch: { role: {$in: roles}, write: true }}};
				}					
												
				Model.findOne(query, function(err, item) {
					if(err) { return res.sendStatus(500); }
					if (item) {
						if (item.pluginData & item.pluginData.youtube) {
							res.status(200).send(item.pluginData.youtube);
						}
						else {
							res.status(200).send({});				
						}
					}
					else {
						res.sendStatus(404);
					}
				});
			}
		]
	},

	updateModel: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Model.findByIdAndUpdate({"_id": req.params.id }, {"$set": {"pluginData.youtube": req.body}}, function(err, item) {
					if(err) { return res.sendStatus(500); }
					if (item) {
						res.status(204).send(item);
					}
					else {
						res.sendStatus(500);
					}
				});
			}
		]
	}	
}
