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
var AuthController = require(__dirname + '/../../../../controllers/auth');

exports.routes = {
	listModel: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {
			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var query = {};				
				
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
			}
		]
	}
}

