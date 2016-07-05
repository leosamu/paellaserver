var Catalog = require(__dirname + '/../../../../../models/catalog');
var Channel = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');


exports.routes = {
	getChannel: {
		get: [
			function(req, res) {
				Channel.findOne({"pluginData.sakai.code": req.params.site}, function(err, item) { 
					if (err) {
						return res.sendStatus(500);
					}
					if (item) {
						res.send({site: req.params.site, channel:item._id});
					}
					else {
						res.sendStatus(404);
					}
				})				
			}
		]
	},
	createChannel: {
		put: [
			AuthController.CheckRole(['ADMIN']),
			function(req, res) {
				Catalog.findOne({_id:"videoapuntes"},function(err, catalog){
					if (err) { return res.sendStatus(500); }
								
					Channel.findOne({"pluginData.sakai.code": req.params.site}, function(err, item) { 
						if (err) { return res.sendStatus(500); }									
						if (item) {
							res.send({site: req.params.site, channel:item._id});
						}
						else {
							var ch = new Channel({							
								hidden: true,
								hiddenInSearches: true,
								owner: [ req.user._id ],
								pluginData: {
									sakai: { code: req.params.site }
								},
								repository: catalog.defaultRepositoryForChannels,
								catalog: catalog._id,
								title: "Asignatura " + req.params.site
							});
							
							ch.save(function(err, item){
								if (err) { return res.sendStatus(500);}
								
								item.updateSearchIndex();
								res.send({site: req.params.site, channel:item._id});
							})						
						}
					})
				})
			}
		]
	}
}
