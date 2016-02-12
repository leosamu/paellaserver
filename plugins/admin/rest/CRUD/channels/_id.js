var Model = require(__dirname + '/../../../../../models/channel');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../controllers/catalog');

exports.routes = {
	getModel: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {
				CatalogController.catalogsCanAdminister(req.user)
				.then(
					function(catalogs){	
						var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});
						var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
						var query = {"$and":[{"_id": req.params.id}, qcatalogs]};
										
						Model.findOne(query)
						.populate('repository')
						.populate('owner')
						.populate('children')
						.populate('videos')						
						.exec(function(err, item) {
							if(err) { return res.sendStatus(500); }
							
							if (item) {
								Model.populate(item, {path: 'children.owner', model:"User"}, function(err, item){
									if(err) { return res.sendStatus(500); }
									Model.populate(item, {path: 'videos.owner', model:"User"}, function(err, item){
										if(err) { return res.sendStatus(500); }
										res.status(200).send(item);
									});
								});
							}
							else {
								res.sendStatus(404);
							}
						});	
					},
					function(){
						return res.sendStatus(500);
					}
				);						
			}
		]
	},
	
	removeModel: {
		delete: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res,next) {
				Model.findOne({_id: req.params.id}, function(err, item){
					if(err) { return res.sendStatus(500); }	
					if (!item) { return res.sendStatus(404); }
					
					return (CatalogController.CheckWriteInCatalog(item.catalog))(req,res,next);					
				})
			},
			function(req,res) {
				Model.findByIdAndUpdate({"_id": req.params.id }, {$set: {deletionDate: Date.now()}}, function(err, item) {
					if(err) { return res.sendStatus(500); }			
					if (item) {
						res.sendStatus(204);
					}
					else {
						res.sendStatus(500);
					}
				});
			}
		]
	},

	updateModel: {
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			CatalogController.CheckWrite,
			function(req,res) {			
				Model.update({"_id": req.params.id }, req.body, {overwrite: true}, function(err) {
					if(err) { return res.sendStatus(500); }
					
					Model.findOne({"_id": req.params.id }, function(err, ch) {
						if (ch) {ch.updateSearchIndex()}	
					});				
					res.sendStatus(204);
				});
			}
		]
	}
	
}
