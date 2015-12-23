var Video = require(__dirname + '/../../../../../models/video');
var Task = require(__dirname + '/../../../../../models/task');

var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	list: { 
		post: [
			AuthController.EnsureAuthenticatedOrDigest,
			AuthController.CheckRole(['YOUTUBE_UPLOADER', 'ADMIN']),
			function(req, res) {
			
				Video.findOne({_id: req.params.id}, function(err, item) {
					if(err) { return res.status(500).send(err); }
					if (item) {			
						var task = new Task({
							task: "uploadOaToYoutube",	
							targetType: "video",
							targetId: req.params.id,
							error: false
						});
						
						task.save(function(err) {
							if(err) { return res.status(500).send(err); }
							Video.findByIdAndUpdate({"_id": req.params.id }, {$set:{ "pluginData.youtube.task": task._id}}, function(err, item) {
								if(err) { return res.status(500).send(err); }
								if (item) {
									res.status(201).send(item);
								}
								else {
									res.sendStatus(500);
								}
							});
						});
					}
					else {
						res.sendStatus(404);
					}
				});
			}
		]
	}
}
