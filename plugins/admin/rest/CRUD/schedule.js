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

var AuthController = require(__dirname + '/../../../../controllers/auth');
var ScheduledTask = require(__dirname + '/../../../../models/scheduledtask');


exports.routes = {
	schedule: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var query = {};
				if (req.query.filters != null) {
					query = JSON.parse(new Buffer((req.query.filters), 'base64').toString());
				}
							
				ScheduledTask.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					ScheduledTask.find(query)
					.sort({priority:-1, creationDate:-1})					
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
	
	update: { 
		param: 'id',
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {
				ScheduledTask.update({"_id": req.params.id }, req.body, {overwrite: true}, function(err) {
					if(err) { 
						return res.sendStatus(500);
					}
					res.sendStatus(204);
				});
			}			
		]
	}	
}

