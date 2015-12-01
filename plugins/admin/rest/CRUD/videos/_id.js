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
				Video.findByIdAndUpdate({"_id": req.params.id }, {$set: {deletionDate: Date.now()}}, function(err, item) {
					if(err) { return res.sendStatus(500); }			
					if (item) {
						res.sendStatus(204);
					}
					else {
						res.sendStatus(500);
					}
				});
			}
		]
	},

	updateVideo: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				Video.findByIdAndUpdate({"_id": req.params.id }, req.body, function(err, item) {
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
