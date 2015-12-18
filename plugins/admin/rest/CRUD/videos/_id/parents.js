var VideoModel = require(__dirname + '/../../../../../../models/video');
var ChannelModel = require(__dirname + '/../../../../../../models/channel');

var AuthController = require(__dirname + '/../../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../../controllers/catalog');

exports.routes = {
	channelParents: { 
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				
				CatalogController.catalogsCanAdminister(req.user)
				.then(
					function(catalogs){
						var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});					
						var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
						var query = {"$and":[{"_id": req.params.id}, qcatalogs]};
								
						VideoModel.findOne(query)
						.exec(function(err, item){
							if(err) { return res.sendStatus(500); }
							
							var query = {videos: req.params.id};						
							ChannelModel.find(query).count().exec(function(errCount, count) {
								if(errCount) { return res.sendStatus(500); }

								ChannelModel.find(query)
								.sort("-creationDate")					
								.skip(skip)
								.limit(limit)
								.populate('repository')
								.populate('owner')
								.exec(function(err, items) {
									if(err) { return res.sendStatus(500); }
															
									res.status(200).send({
										total: count,
										skip: Number(skip),
										limit: Number(limit),
										list: items
									})
								});					
							});						
							
						})										
					},
					function(){
						return res.sendStatus(500);
					}
				);
			}
		]
	}
}
