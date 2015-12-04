var Model = require(__dirname + '/../../../../../models/catalog');
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
						res.status(200).send(item);
					}
					else {
						res.sendStatus(404);
					}
				});
			}
		]
	},
	
	removeModel: {
		delete: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Model.remove({"_id": req.params.id }, function(err, todo) {
					if (!err) {
						res.sendStatus(204);
					}
					else {
						res.sendStatus(500);
					}
			    });
			}
		]
	},

	updateModel: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Model.findByIdAndUpdate({"_id": req.params.id }, req.body, function(err, item) {
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
