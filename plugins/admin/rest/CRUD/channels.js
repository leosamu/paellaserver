/*
	404 - Not Found
	204 - Updated
	201 - Created
	200 - Response
	400 - Bad Request
	403 - Forbiden
	401 - Unauthorized
	500 - Internal Server Error
*/

var Model = require(__dirname + '/../../../../models/channel');
var Catalog = require(__dirname + '/../../../../models/catalog');
var AuthController = require(__dirname + '/../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../controllers/catalog');

exports.routes = {
	listModel: { 
		get: [
			AuthController.EnsureAuthenticatedOrDigest,
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var filters = JSON.parse(new Buffer((req.query.filters), 'base64').toString());				
				
				CatalogController.catalogsCanAdminister(req.user)
				.then(
					function(catalogs){
						var isAdmin = req.user.roles.some(function(a) {return a.isAdmin;});					
						var qcatalogs = (isAdmin)? {} : {"catalog": {"$in": catalogs}};
						var query = {"$and":[qcatalogs, filters]};
				
						Model.find(query).count().exec(function(errCount, count) {
							if(errCount) { return res.sendStatus(500); }
							
							Model.find(query)
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
					},
					function(){
						return res.sendStatus(500);
					}
				);
			}
		]
	},
	
	createChannel: {
		post: [
			AuthController.EnsureAuthenticatedOrDigest,
			CatalogController.CheckWrite,
			function(req,res) {			
				var item = new Model(req.body);
				
				item.save(function(err) {
					if(!err) {
						res.status(201);
						res.send(item);
					}
					else {
						res.sendStatus(500);
					}
				});				
			}
		]
	}	
	
	
	
}

