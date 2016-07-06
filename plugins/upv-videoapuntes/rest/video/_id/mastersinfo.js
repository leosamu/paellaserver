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
				*/						
				Video.findOne({_id: req.params.id}, function(err, video){
					if (err) { return res.sendStatus(500); }
					
					if (video) {					
						if ( (!video.source) && (!video.source.master) && (!video.source.master.repository)) {
							return res.sendStatus(500);	
						}						
						video.source.master.files = req.body.files;						
						return res.sendStatus(204);
					}
					else {
						return res.sendStatus(404);
					}
				});
			}			
		]
	}	

}
