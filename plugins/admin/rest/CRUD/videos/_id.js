var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	getVideo: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var query = {};				
				
				Video.findById(req.params.id)
				.populate('repository')
				.populate('owner')					
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
	
	removeVideo: {
		delete: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.sendStatus(500);
			}
		]
	},

	updateVideo: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.sendStatus(500);
			}
		]
	}
	
}