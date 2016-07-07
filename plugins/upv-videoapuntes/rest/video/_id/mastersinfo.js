var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');


exports.routes = {
	addVideos: {
		patch: [
			AuthController.CheckRole(['ADMIN']),			
			function(req, res) {
				/*
				body:
				{
					files: [
						{
							name: { type:String },
							tag: { type:String }
						}
					]
				}
				*/
				Video.findOne({_id: req.params.id}, function(err, video){
					if (err) { return res.sendStatus(500); }
					
					if (video) {					
						if ( (!video.source) || (!video.source.masters) || (!video.source.masters.repository)) {
							return res.sendStatus(500);	
						}						
						video.source.masters.files = req.body.files;
						video.save(function(err){
							if (err) { return res.sendStatus(500); }							
							res.sendStatus(204);
						});
					}
					else {
						return res.sendStatus(404);
					}
				});
			}			
		]
	}	

}
