var Channel = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var Q = require('q');


exports.routes = {
	copyToYoutube: {
		put: [
			AuthController.CheckRole(['YOUTUBE_UPLOADER','ADMIN']),
			function(req,res) {
				Channel.findOne({"_id": req.params.id }, function(err, item) {
					if(err) { return res.sendStatus(500); }
					
					if (item) {						
						function getAllVideos(ch) {
							var promises = []
							ch.children.forEach(function(cid){
							
								var p = Channel.findOne({"_id": cid }).exec()
								.then(function(c){
									return getAllVideos(c);
								})
								
								promises.push(p);
								
							});
							
							return Q.all(promises).then(function(rets){
								var videos = [];
								rets.forEach(function(v){
									videos = videos.concat(v);
								});
								videos = videos.concat(ch.videos);
								return videos;
							})
						}

						getAllVideos(item).then(function(videos){
							var new_ch = {
								creationDate: new Date(),
								hidden: false,
								hiddenInSearches: false,
								owner: [  ],
								pluginData: {},
								thumbnail: null,
								catalog: 'youtube',
//								repository: { type:String, ref:'Repository' },
								title: item.title,
								permissions: null,
								videos: videos,
								children: []
							};

							res.status(200).send(new_ch);
						})
						
					}
					else {
						res.sendStatus(500);
					}					
					
				});						
			}
		]
	}	
}
