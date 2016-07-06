var Video = require(__dirname + '/../../../models/video');
var Task = require(__dirname + '/../../../models/task');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	ingest: { param: 'id', put: [
		AuthController.CheckRole(['ADMIN']),	
		function(req,res,next) {		
				var task = new Task({
					task: "translectures",
					targetType: "video",
					targetId: req.params.id,
					error: false,
					priority: 5
				});
				
				task.save(function(err) {
					if(err) { return res.sendStatus(500); }
					
					Video.findByIdAndUpdate({"_id": req.params.id }, {"$set": {"pluginData.translectures.task": task._id}}, function(err, item) {
						if(err) { return res.sendStatus(500); }
						if (item) {
							res.sendStatus(204);
						}
						else {
							res.sendStatus(500);
						}
					});
				});
		}]
	}	
}
