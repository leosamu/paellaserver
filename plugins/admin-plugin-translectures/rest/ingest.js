var Video = require(__dirname + '/../../../models/video');
var Task = require(__dirname + '/../../../models/task');
var AuthController = require(__dirname + '/../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../controllers/catalog');

exports.routes = {
	ingest: { param: 'id', put: [
		function(req,res,next) {
			Video.findOne({_id:req.params.id}, function(err, item){
				if(err) { return res.sendStatus(500); }
				if (item) {
					if (!item.catalog) {
						return res.sendStatus(500);
					}
					return (CatalogController.CheckWriteInCatalog(item.catalog))(req,res,next);					
				}
				else {
					return res.sendStatis(404);
				}
			})		
		},		
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
