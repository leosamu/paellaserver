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

var Model = require(__dirname + '/../../../../models/task');
var AuthController = require(__dirname + '/../../../../controllers/auth');

exports.routes = {
	list: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var query = {};
				if (req.query.filters != null) {
					query = JSON.parse(new Buffer((req.query.filters), 'base64').toString());
				}
				console.log(req.query.filters);
				console.log(query);
							
				Model.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					Model.find(query)
					.skip(skip)
					.limit(limit)
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
	},
	
	createModel: {
		post: [
			AuthController.CheckRole(['ADMIN']),
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
	},	
}







