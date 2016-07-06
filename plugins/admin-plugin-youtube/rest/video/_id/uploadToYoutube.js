var Video = require(__dirname + '/../../../../../models/video');
var Task = require(__dirname + '/../../../../../models/task');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	uploadToYoutube: {
		put: [
			AuthController.CheckRole(['YOUTUBE_UPLOADER', 'ADMIN']),
			function(req,res) {
				var task = new Task({
					task: "uploadToYoutube",
					targetType: "video",
					targetId: req.params.id,
					error: false
				});
				
				task.save(function(err) {
					if(err) { return res.sendStatus(500); }
					
					Video.findByIdAndUpdate({"_id": req.params.id }, {"$set": {"pluginData.youtube.task": task._id}}, function(err, item) {
						if(err) { return res.sendStatus(500); }
						if (item) {
							res.sendStatus(204);
						}
						else {
							res.sendStatus(500);
						}
					});
				});
							
			}
		]
	}	
}
