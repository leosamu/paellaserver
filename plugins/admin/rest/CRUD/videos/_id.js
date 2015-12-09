var Video = require(__dirname + '/../../../../../models/video');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../controllers/catalog');

exports.routes = {
	getVideo: {
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {
							
				CatalogController.catalogsCanAdminister(req.user)
				.then(
					function(catalogs){					
						var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});
						var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
						var query = {"$and":[{"_id": req.params.id}, qcatalogs]};
													
						Video.findOne(query)
						.populate('repository')
						.populate('owner')					
						.exec(function(err, item) {
							if(err) { return res.sendStatus(500); }
							
							if (item) {
								res.status(200).send(item);
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
	
	removeVideo: {
		delete: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res,next) {
				Video.findOne({_id: req.params.id}, function(err, item){
					if(err) { return res.sendStatus(500); }	
					if (!item) { return res.sendStatus(404); }
					
					return (CatalogController.CheckWriteInCatalog(item.catalog))(req,res,next);					
				})
			},
			function(req,res) {			
				Video.findByIdAndUpdate({"_id": req.params.id }, {$set: {deletionDate: Date.now()}}, function(err, item) {
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

	updateVideo: {
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			CatalogController.CheckWrite,
			function(req,res,next) {
				Video.findOne({_id: req.params.id}, function(err, item){
					if(err) { return res.sendStatus(500); }	
					if (!item) { return res.sendStatus(404); }
					
					return (CatalogController.CheckWriteInCatalog(item.catalog))(req,res,next);					
				})
			},			
			function(req,res) {			
				Video.findByIdAndUpdate({"_id": req.params.id }, req.body, function(err, item) {
					if(err) { return res.sendStatus(500); }
					if (item) {
						res.status(204).send(item);
					}
					else {
						res.sendStatus(500);
					}
				});
			}
		]
	}
	
}
