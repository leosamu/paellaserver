var Channel = require(__dirname + '/../../../../../models/channel');
var Task = require(__dirname + '/../../../../../models/task');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	uploadToYoutube: {
		put: [
			AuthController.CheckRole(['YOUTUBE_UPLOADER', 'ADMIN']),
			function(req,res) {
			
				Channel.findOne({_id: req.params.id}, function(err, item){
					if ((err) || (item.catalog != 'youtube') ) {
						return res.sendStatus(500);
					}
						
					var task = new Task({
						task: "uploadToYoutube",
						targetType: "channel",
						targetId: req.params.id,
						error: false
					});
					
					task.save(function(err) {
						if(err) { return res.sendStatus(500); }
						
						Channel.findByIdAndUpdate({"_id": req.params.id }, {"$set": {"pluginData.youtube.task": task._id}}, function(err, item) {
							if(err) { return res.sendStatus(500); }
							if (item) {
								res.sendStatus(204);
							}
							else {
								res.sendStatus(500);
							}
						});
					});
					
				});
										
			}
		]
	}	
}
