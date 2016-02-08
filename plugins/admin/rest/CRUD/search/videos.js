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

var Video = require(__dirname + '/../../../../../models/video');
var Catalog = require(__dirname + '/../../../../../models/catalog');
var AuthController = require(__dirname + '/../../../../../controllers/auth');
var CatalogController = require(__dirname + '/../../../../../controllers/catalog');





exports.routes = {
	search: { 
		get: [
			AuthController.CheckRole(['ADMIN', 'ADMINISTRATION_UI']),
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var filters = JSON.parse(new Buffer(req.query.filters, 'base64').toString());
								
				var query = filters;
				
				Video.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					Video.find(query)
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
							list:items							
						});
					});					
				});
			}
		]
	}
}

