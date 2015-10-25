var Model = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	getModel: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var query = {};				
				
				Model.findById(req.params.id)
				.populate('repository')
				.populate('owner')
				.populate('children')
				.populate('videos')
				
				.exec(function(err, item) {
					if(err) { return res.sendStatus(500); }
					
					if (item) {
						Model.populate(item, {path: 'children.owner', model:"User"}, function(err, item){
							if(err) { return res.sendStatus(500); }
							Model.populate(item, {path: 'videos.owner', model:"User"}, function(err, item){
								if(err) { return res.sendStatus(500); }
								res.status(200).send(item);
							});
						});
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
				res.sendStatus(500);
			}
		]
	},

	updateModel: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.sendStatus(500);
			}
		]
	}
	
}
