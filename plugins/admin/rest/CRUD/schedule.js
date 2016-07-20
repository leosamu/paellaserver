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
var Scheduler = require(__dirname + '/../../../../services/scheduler');


exports.routes = {
	schedule: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {
				var jobs = [];
				Scheduler.getJobsList().forEach(function(j){
					jobs.push({name: j.name, rule: j.rule})
				});
				
				res.send(jobs);
			}
		]
	}
}

