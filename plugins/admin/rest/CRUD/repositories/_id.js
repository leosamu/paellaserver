var Model = require(__dirname + '/../../../../../models/repository');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	getModel: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var query = {};				
				
				Model.findById(req.params.id)				
				.exec(function(err, item) {
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
				Model.update({"_id": req.params.id }, req.body, {overwrite: true}, function(err) {
					if(err) { return res.sendStatus(500); }
					res.status(204);
				});
			}
		]
	}
	
}
